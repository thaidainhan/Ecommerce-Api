"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

const { grantAccess } = require("../../middlewares/rbac.middleware");
const {
  newRole,
  listRoles,
  newResource,
  listResources,
} = require("../../controllers/rbac.controller");

// admin
router.post("/role", asyncHandler(newRole));
router.get("/roles", asyncHandler(listRoles));

router.post("/resource", asyncHandler(newResource));
router.get("/resources", asyncHandler(listResources));

module.exports = router;
