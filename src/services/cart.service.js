"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
  // * Start repo cart
  static async createUserCart({ userId, product }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  // * End repo cart

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.productId": productId,
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    // check cart ton tai khong?
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      return await this.createUserCart({ userId, product });
    }

    //  neu co gio hang roi nhung chua co san pham?
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // gio hang ton tai va co san pham roi thi update quantity
    return await this.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids }) {
    // shop_order_ids: [
    //     {
    //         shopId,
    //         item_products: [
    //             {
    //                 quantity,
    //                 price,
    //                 shopId,
    //                 old_quantity,
    //                 productId
    //             }
    //         ]
    //     }
    // ]

    console.log({shop_order_ids});

    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // check san pham ton tai hay khong
    const foundProduct = await getProductById(productId);
    if (!foundProduct) {
      throw new NotFoundError("product not found");
    }
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("product do not belong to the shop");
    }

    if (quantity === 0) {
      // delete
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteCartItem({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleted = await cartModel.updateOne(query, updateSet);

    return deleted;
  }

  static async getListUserCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
