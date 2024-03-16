"use strict";

const { Created, OK } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  // Create New
  addToCart = async (req, res, next) => {
    new Created({
      message: "Create new cart success!",
      metadata: await CartService.addToCart({
        ...req.body,
      }),
    }).send(res);
  };
  // Update + -
  updateCart = async (req, res, next) => {
    new Created({
      message: "update cart success!",
      metadata: await CartService.addToCartV2(req.body),
      
    }).send(res);
  }
  // Delete 
  deleteCartItem = async (req, res, next) => {
    new Created({
      message: "delete cart success!",
      metadata: await CartService.deleteCartItem({
        ...req.body,
      }),
    }).send(res);
  };

  // Get List
  listToCart = async (req, res, next) => {
    new OK({
      metadata: await CartService.getListUserCart({
        ...req.query,
      }),
    }).send(res);
  };
}
module.exports = new CartController();
