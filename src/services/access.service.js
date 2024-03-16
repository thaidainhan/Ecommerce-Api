"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData, generateKeyPair } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshToken = async ({refreshToken, user, keyStore}) => {
    // * 1 - Check token used
    const {userId, email} = user

    if(keyStore.refreshTokensUsed.includes(refreshToken)){
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened, please relogin!");
    }

    if(keyStore.refreshToken !== refreshToken){
      throw new AuthFailureError("Shop not registered!");
    }

    const foundShop = await findByEmail({email: email});
    if (!foundShop) {
      throw new NotFoundError("Shop not found!");
    }

    // * 3 - Tao cap token moi
    const payload = {
      userId,
      email
    }
    const tokens = await createTokenPair({payload, publicKey: keyStore.publicKey, privateKey: keyStore.privateKey})

    // * 4 - Update tokens moi
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user,
      tokens
    }

    
  };

  static logout = async (keyStore) => {
    // * 1 - Check email in db
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // *1 Check email in db
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    // *2 Math password
    const math = bcrypt.compare(password, foundShop.password);
    if (!math) {
      throw new AuthFailureError("Authentication error");
    }
    // *3 Create AT & RT and save
    const { privateKey, publicKey } = generateKeyPair();

    const { _id: userId } = foundShop;

    const payload = {
      userId,
      email: email,
    };

    // Created token pair
    const tokens = await createTokenPair({
      payload,
      privateKey,
      publicKey,
    });

    await KeyTokenService.createKeyToken({
      userId,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };

    // *4 Get data return login
  };
  static signUp = async ({ name, email, password }) => {
    // step1: check email exists?
    const holderShop = await shopModel
      .findOne({
        email: email,
      })
      .lean();

    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // Created privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   privateKeyEncoding: {
      //     type: "pkcs1", //pkcs8
      //     format: "pem",
      //   },
      //   publicKeyEncoding: {
      //     type: "pkcs1", //pkcs8
      //     format: "pem",
      //   },
      // });

      const { privateKey, publicKey } = generateKeyPair();

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
      }); // save collection keyStore

      if (!keyStore) {
        throw new BadRequestError("Error: Shop already registered!");
      }

      const payload = {
        userId: newShop._id,
        email: newShop.email,
      };

      // Created token pair
      const tokens = await createTokenPair({
        payload,
        privateKey,
        publicKey,
      });

      return {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
  };
}

module.exports = AccessService;
