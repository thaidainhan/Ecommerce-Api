"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();

// Authentication
router.use(authentication);

router.post("/", asyncHandler(commentController.createComment));
router.get("/", asyncHandler(commentController.getCommentByParentId));
router.delete("/", asyncHandler(commentController.deleteComments));

module.exports = router;
