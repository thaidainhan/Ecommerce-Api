"use strict";

const { SuccessReponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  getListNotiByUser = async (req, res, next) => {
    new SuccessReponse({
      message: "",
      metadata: await NotificationService.getListNotiByUser({
        ...req.query
      }),
    }).send(res);
  };
}

module.exports = new NotificationController();
