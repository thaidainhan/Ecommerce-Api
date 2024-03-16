"use strict";

const { Created, OK } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new Created({
      message: "create new comment new",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };
  getCommentByParentId = async (req, res, next) => {
    new OK({
      message: "get comments new",
      metadata: await CommentService.getCommentByParentId(req.query),
    }).send(res);
  };
  deleteComments = async (req, res, next) => {
    new OK({
      message: "delete comments successfully",
      metadata: await CommentService.deleteComments(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
