"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodeUnselect,
  checkDiscountExists,
  findAllDiscountCodeSelect,
} = require("../models/repositories/discount.repo");
/*
 * 1. Generator Discount Code [Shop | Admin]
 * 2. Get Discount Amount [User]
 * 3. Get All Discount Codes [User | Shop]
 * 4. Verify Discount Code [User]
 * 5. Delete Discount Code [Admin | Shop]
 * 6. Cancel Discount Code [User]
 */

class DiscountService {
  static async createDiscountCode(body) {
    const {
      name,
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      description,
      type,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
      value,
    } = body;

    // kiem tra ngay

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date!");
    }

    // create index for discount
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_shopId: shopId,
      discount_code: codeId,
    });
    return deleted;
  }
  // User Cancel
  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopid: convertToObjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`discount does'nt exists`);
    }

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }

  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount_code

    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products;

    if (discount_applies_to == "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to == "specific") {
      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids,
          },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ["_v", "discount_code","discount_name"],
      model: discountModel,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
      model: discountModel,
    });

    if (!foundDiscount) {
      throw new NotFoundError(`discount does'nt exists`);
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_name,
      discount_value,
      discount_end_date,
      discount_start_date,
      discount_max_uses_per_user,
      discount_type
    } = foundDiscount;






    if (!discount_is_active) {
      throw new NotFoundError(`discount expried`);
    }
    if (!discount_max_uses) {
      throw new NotFoundError(`discount are out`);
    }
    // kiem tra ngay

    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestError("Start date must be before end date!");
    }

    // check xem co xet gia tri toi thieu hay khong
    let totalOrder = 0;
    let INIT_TOTAL_ORDER = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        const productPrice = product.quantity * product.price;
        return acc + productPrice;
      }, INIT_TOTAL_ORDER);
    }
    if (totalOrder < discount_min_order_value) {
      throw new BadRequestError(
        `Discount requires a minimum order value of ${discount_min_order_value}`
      );
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUsedDiscount) {
        throw new BadRequestError(
          `This user has already used discount ${discount_name}`
        );
      }
    }

    // check xem discount la fixed amount?

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
}

module.exports = DiscountService;
