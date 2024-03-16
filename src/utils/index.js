"use strict";
const crypto = require("crypto");
const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => {
  return new Types.ObjectId(id);
   
};

// ['a','b'] => [ {a:1, b:1} ]
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((e) => [e, 1]));
};

// ['a','b'] => [ {a:0, b:0} ]
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((e) => [e, 0]));
};

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const generateKeyPair = () => {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");

  return {
    privateKey,
    publicKey,
  };
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (!obj[k]) {
      delete obj[k];
    }
  });

  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};

  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};

module.exports = {
  getInfoData,
  generateKeyPair,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
