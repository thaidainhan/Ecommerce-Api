"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();




router.post("", asyncHandler(cartController.addToCart))
router.delete("", asyncHandler(cartController.deleteCartItem))
router.patch("", asyncHandler(cartController.updateCart))
router.get("", asyncHandler(cartController.listToCart))


// Authentication
router.use(authentication)




module.exports = router;
