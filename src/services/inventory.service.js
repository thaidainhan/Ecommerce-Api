"use strict";

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
const inventoriesModel = require("../models/inventories.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static addStockToInventory = async ({
    stock,
    productId,
    shopId,
    location = "HCM",
  }) => {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("The product does not exists!");

    const query = { inventory_shopId: shopId, inventory_productId: productId },
      updateSet = {
        $inc: {
          inventory_stock: stock,
        },
        $set: {
          inventory_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      };

    return await inventoriesModel.findOneAndUpdate(query, updateSet, options);
  };
}

module.exports = InventoryService;
