"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct))
router.get("/", asyncHandler(productController.getListProduct))

// Authentication
router.use(authentication)



router.post("/", asyncHandler(productController.createProduct))
router.put("/publish/:id", asyncHandler(productController.publishProductByShop))
router.put("/unPublish/:id", asyncHandler(productController.unPublishProductByShop))
router.patch("/:product_id", asyncHandler(productController.updateProduct))




// Query
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop))
router.get("/published/all", asyncHandler(productController.getAllPublishedForShop))

module.exports = router;
