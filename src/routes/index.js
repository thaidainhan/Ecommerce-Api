"use strict";

const express = require("express");
const router = express.Router();

const { apiKey, permissions } = require("../auth/checkAuth");
const { pushToLogDiscord } = require("../middlewares/");

// * Add log to discord
router.use(pushToLogDiscord);

// * Check Api Key
router.use(apiKey);

// * Check permission
router.use(permissions({ permission: "0000" }));

router.use("/v1/api/shop", require("./access"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/profile", require("./profile"));
router.use("/v1/api/rbac", require("./rbac"));

module.exports = router;
