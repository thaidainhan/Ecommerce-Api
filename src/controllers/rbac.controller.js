"use strict";

const { OK } = require("../core/success.response");
const {
  createResource,
  createRole,
  roleList,
  resourceList,
} = require("../services/rbac.service");

/**
 *
 * @desc Create a new role
 * @param {string} name
 * @param {*} res
 * @param {*} next
 */
const newRole = async (req, res, next) => {
  new OK({
    message: "created role",
    metadata: await createRole(req.body),
  }).send(res);
};

const newResource = async (req, res, next) => {
  new OK({
    message: "created resource",
    metadata: await createResource(req.body),
  }).send(res);
};
const listRoles = async (req, res, next) => {
  new OK({
    message: "get list roles",
    metadata: await roleList(req.query),
  }).send(res);
};

const listResources = async (req, res, next) => {
  new OK({
    message: "get list resources",
    metadata: await resourceList(req.query),
  }).send(res);
};
module.exports = {
  newRole,
  newResource,
  listRoles,
  listResources,
};
