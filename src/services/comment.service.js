"use strict";

const { NotFoundError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { findOneProduct } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");
/**
 * add comment [User, Shop]
 * get a list
 * delete a comment [User, Shop , Adminw]
 */

class CommentService {
  constructor() {}

  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;

    if (parentCommentId) {
      // reply
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError("Comment not found" + parentCommentId);
      }

      rightValue = parentComment.comment_right;
      //  update many comments
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        {
          sort: {
            comment_right: -1,
          },
        }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }

      //   insert to comment
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();

    return comment;
  }
  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);
      if (!parent) {
        throw new NotFoundError("Not found comment: " + parentCommentId);
      }
      const comments = await commentModel
        .find({
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: {
            $gt: parent.comment_left,
          },
          comment_right: {
            $lte: parent.comment_right,
          },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });
      return comments;
    } else {
      const comments = await commentModel
        .find({
          comment_productId: convertToObjectIdMongodb(productId),
          comment_parentId: parentCommentId,
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });
      return comments;
    }
  }
  static async deleteComments({ commentId, productId }) {
    // check exist
    const foundProduct = await findOneProduct({
      product_id: productId,
    });

    if (!foundProduct) {
      throw new NotFoundError("Product not found: " + productId);
    }

    // 1. Xác định giá trị left và right
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundError("comment not found: " + commentId);
    }

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // 2. Tính width
    const width = rightValue - leftValue + 1;
    // 3. Xoá comments con
    await commentModel.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: {
        $gte: leftValue,
        $lte: rightValue,
      },
    });
    // 4. Cập nhật giá trị left và right
    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: {
          $gt: rightValue,
        },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );
    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: {
          $gt: rightValue,
        },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );

    return true;
  }
}

module.exports = CommentService;
