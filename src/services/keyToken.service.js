"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId };
      const update = {
        privateKey,
        publicKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = {
        upsert: true,
        new: true,
      };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  static findByUserId = async ( userId ) => {
    return await keyTokenModel.findOne({ user: userId })
  };
  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({
      refreshTokensUsed: {
        $in: refreshToken
      },
    });
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel
      .findOne({
        refreshToken: refreshToken,
      })
      
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: userId,
    });
  };
}

module.exports = KeyTokenService;
