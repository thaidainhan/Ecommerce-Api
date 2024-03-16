"use strict";

const { Created, OK } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new Created({
      message: "Successful Code Generation",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res)
  };

  getAllDiscountCodeByShop = async (req, res, next) => {
    new OK({
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res)
  };

  getAllDiscountCodeWithProduct = async (req, res, next) => {
    new OK({
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    }).send(res)
  };

  getDiscountAmount = async (req, res, next) => {
    new OK({
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res)
  };
}
module.exports = new DiscountController();
