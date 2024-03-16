"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk } = require("../../configs/multer.config");
const router = express.Router();

// Authentication
router.use(authentication);

router.post("/product/url", asyncHandler(uploadController.uploadImageFromUrl));
router.post(
  "/product/file",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadImageFromLocal)
);

module.exports = router;
