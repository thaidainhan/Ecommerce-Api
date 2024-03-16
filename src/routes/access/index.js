"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

// signUp
router.post("/signup", asyncHandler(accessController.signUp))
router.post("/login", asyncHandler(accessController.login))

// Authentication
router.use(authentication)


router.post("/logout", asyncHandler(accessController.logout))
router.post("/handlerRefreshToken", asyncHandler(accessController.handlerRefreshToken))

module.exports = router;
