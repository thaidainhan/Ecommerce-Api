"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();

// Authentication
router.use(authentication)

router.get("/", asyncHandler(notificationController.getListNotiByUser))


module.exports = router;
