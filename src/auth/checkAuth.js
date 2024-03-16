"use strict";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const {findById} = require("../services/apiKey.service")

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    // check object key
    const objKey = await findById({key: key})
    if(!objKey) {
        return res.status(403).json({
            message: "Forbidden",
          });
    }

    req.objKey = objKey
    return next()
  } catch (error) {
    console.error(error);
  }
};


const permissions = ({permission}) => {
    return (req,res,next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: "Permison Deined!",
              });
        }

        console.log('permision::',req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: "Permison Deined!",
              });
        }

        return next()

    }
}



module.exports = {
    apiKey,
    permissions,
}