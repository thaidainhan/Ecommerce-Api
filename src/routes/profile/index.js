"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const profileController = require("../../controllers/profile.controller");
const router = express.Router();

const { grantAccess } = require("../../middlewares/rbac.middleware");

// admin
router.get(
  "/viewAny",
  grantAccess({
    action: "readAny",
    resource: "profile",
  }),

  profileController.profiles
);

// shop
router.get(
  "/viewOwn",
  grantAccess({
    action: "readOwn",
    resource: "profile",
  }),
  profileController.profile
);

module.exports = router;
