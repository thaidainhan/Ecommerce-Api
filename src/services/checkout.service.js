"use strict";

const shopModel = require("../models/shop.model");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");

class CheckoutService {
  // {
  //     cartId,
  //     userId,
  //     shop_order_ids: [
  //         {
  //             shopId,
  //             shop_discounts: [],
  //             item_products:[
  //                 {
  //                     price,
  //                     quantity,
  //                     productId,
  //                 }
  //             ]
  //         }
  //         {
  //             shopId,
  //             shop_discounts: [{
  //                 shopId,
  //                 discountId,
  //                 CodeId
  //              }],
  //             item_products:[
  //                 {
  //                     price,
  //                     quantity,
  //                     productId,
  //                 }
  //             ]
  //         }
  //     ]
  // }

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("cart not found!");
    }

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien discount giam gia
        totalCheckout: 0, // toan thanh toan
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // check product avaiable
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) {
        throw new BadRequestError("order wrong!");
      }

      //  tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      //   tong tien truoc khi xu ly

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //  neu shop_discounts ton tai > 0 check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        // tong cong discout giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //   tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);

    }

    return {
        shop_order_ids,
        shop_order_ids_new,
        checkout_order,
    }
  }

  static async orderByUser (
    {
      shop_order_ids,
      cartId,
      userId,
      user_address = {},
      user_payment = {}
    }
  ) {
    const {shop_order_ids_new, checkout_order} = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    })

    // *Flat Map check lai 1 lan nua xem vuot ton kho hay khong
    // Get new array Products

    const products = new shop_order_ids_new.flatMap( (order) => order.item_products)
    console.log(`[1]:`, products);

    const acquireProducts = []

    for (let i = 0; i < products.length; i++) {
      // *Khoa bi quan 
      const {productId, quantity} = products[i]

      const keyLock = await acquireLock({
        productId,
        quantity,
        cartId
      })

      if(keyLock){
        await releaseLock(keyLock)
      }

    }

    // Neu co 1 san pham het hang trong kho
    if(acquireProducts.includes(false)){
      throw new BadRequestError("Mot so san pham da duoc cap nhat, vui long quay lai gio hang!")
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    })

    // Neu insert thanh cong thi remove product co trong gio hang
    if(newOrder){
      // remove product in my cart

    }

    return newOrder

  }
  
  static async getOrderByUser() {

  }

  static async getOneOrderByUser() {
    
  }
  static async cancelOrderByUser() {
    
  }
  static async updateOrderStatusByShopOrAdmin() {
    
  }

  
}

module.exports = CheckoutService;
