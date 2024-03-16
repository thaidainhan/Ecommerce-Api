"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();




router.post("/review", asyncHandler(checkoutController.checkoutPreview))


// Authentication
router.use(authentication)




module.exports = router;
