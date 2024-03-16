"use strict";

const { Created, OK } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new Created({
      message: "Create new cart success!",
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
      }),
    }).send(res);
  };

}
module.exports = new InventoryController();
