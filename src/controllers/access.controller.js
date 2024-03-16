"use strict";

const { Created, SuccessReponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    //    return res.status(201).json(await AccessService.signUp(req.body))
    new SuccessReponse({
      message: "Get Token success!",
      metadata: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    //    return res.status(201).json(await AccessService.signUp(req.body))
    new SuccessReponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    //    return res.status(201).json(await AccessService.signUp(req.body))

    const sendData = Object.assign(
      {
        requestId: req.requestId,
      },
      req.body
    );
    new SuccessReponse({
      metadata: await AccessService.login(sendData),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    //    return res.status(201).json(await AccessService.signUp(req.body))
    new Created({
      message: "Registered successfully",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}
module.exports = new AccessController();
