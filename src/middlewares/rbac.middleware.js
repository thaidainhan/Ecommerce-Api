"use strict";



// grant list fetched from DB (to be converted to a valid grants object, internally)
// let grantList = [
//   {
//     role: "admin",
//     resource: "profile",
//     action: "read:any",
//     attributes: "*, !views",
//   },
//   {
//     role: "shop",
//     resource: "profile",
//     action: "update:own",
//     attributes: "*",
//   },
//   {
//     role: "admin",
//     resource: "profile",
//     action: "delete:any",
//     attributes: "*, !views",
//   },
//   {
//     role: "admin",
//     resource: "blance",
//     action: "read:any",
//     attributes: "*, !views",
//   },
//   {
//     role: "shop",
//     resource: "profile",
//     action: "read:own",
//     attributes: "*",
//   },
// ];


const AccessControl = require("accesscontrol");
const rbac = new AccessControl();

const { AuthFailureError } = require("../core/error.response");
const { roleList } = require("../services/rbac.service");

/**
 *
 * @param {String} action
 * @param {*} resource
 */
const grantAccess = ({ action, resource }) => {
  return async (req, res, next) => {
    try {
      const grants = await roleList({
        userId: 999
      })
      rbac.setGrants(grants)
      const role_name = req.query.role;
      const permission = rbac.can(role_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("you don't have enough permissions...");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
