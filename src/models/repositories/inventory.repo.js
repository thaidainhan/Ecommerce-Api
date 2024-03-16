"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const inventoriesModel = require("../inventories.model");

const { Types } = require("mongoose");

const insertInventory = async ({
  inventory_productId,
  inventory_shopId,
  inventory_stock,
  inventory_location = "unKnow",
  inventory_reservations = [],
}) => {
  return await inventoriesModel.create({
    inventory_productId,
    inventory_shopId,
    inventory_location,
    inventory_stock,
    inventory_reservations,
  });
};

const reservationInventory = async ({productId, quantity, cartId}) => {
  const query = {
    inventory_productId: convertToObjectIdMongodb(productId),
    inventory_stock: {$gte: quantity}
  },updateSet = {
    $inc: {
      inventory_stock: -quantity
    },
    $push: {
      inventory_reservations: {
        quantity,
        cartId,
        createOn: new Date()
      }
    }
  },
  options = {
    upsert: true,
    new: true
  }

  return await inventoriesModel.updateOne(query, updateSet, options)
}

module.exports = {
  insertInventory,
  reservationInventory
}