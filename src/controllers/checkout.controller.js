"use strict";

const { Created, OK } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutPreview = async (req, res, next) => {
    new OK({
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  };
  // Update + -

}
module.exports = new CheckoutController();
