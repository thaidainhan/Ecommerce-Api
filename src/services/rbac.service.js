"use strict";

const { RoleFlags } = require("discord.js");
const RESOURCE = require("../models/resource.model");
const ROLE = require("../models/role.model");

/**
 * new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
  name = "profile",
  slug = "p00001",
  description = "",
}) => {
  try {
    //1. Check name or slug exists
    //2. new resource
    const resource = new RESOURCE({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    await resource.save();

    return resource;
  } catch (error) {
    return error;
  }
};

const resourceList = async ({
  userId = 0,
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    //1. check admin ? middleware function
    //2. get list of resource
    const resources = await RESOURCE.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    return [];
  }
};
const createRole = async ({
  name = "shop",
  slug = "s0001",
  description = "extend from shop or user",
  grants = [],
}) => {
  try {
    // 1. check role exists

    // 2. new role
    const role = new ROLE({
      role_description: description,
      role_slug: slug,
      role_grants: grants,
      role_name: name,
    });

    await role.save();

    return role;
  } catch (error) {
    return error;
  }
};
const roleList = async ({
  userId = 1,
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. userId,

    // 2. List roles
    const roles = await ROLE.aggregate([
      {
        $unwind: "$role_grants",
      },
      {
        $lookup: {
          from: "Resources",
          localField: "role_grants.resource",
          foreignField: "_id",
          as: "resource"
        }
      },
      {
        $unwind: "$resource"
      },
      {
        $project: {
          role: "$role_name",
          resource: "$resource.src_name",
          action: "$role_grants.actions",
          attributes: "$role_grants.attributes"
        }
      },
      {
        $unwind: "$action"
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: "$action",
          attributes: 1
        }
      }

    ]);


    return roles;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
