"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();




router.post("/amount", asyncHandler(discountController.getDiscountAmount))
router.get("/list_product_code", asyncHandler(discountController.getAllDiscountCodeWithProduct))


// Authentication
router.use(authentication)

router.post("", asyncHandler(discountController.createDiscountCode))
router.get("", asyncHandler(discountController.getAllDiscountCodeByShop))


module.exports = router;
