"use strict";

const { BadRequestError } = require("../core/error.response");
const notificationModel = require("../models/notification.model");
const { createNoti } = require("../models/repositories/notification.repo");

class NotificationService {
  static async pushNotiToSystem({
    type = "SHOP-001",
    receivedId = 1,
    senderId = 1,
    options = {},
  }) {
    let content;
    if (type === "SHOP-001") {
      content = "@@@ vừa mới thêm sản phẩm: @@@";
    } else {
      content = "@@@ vừa mới thêm một voucher: @@@@@";
    }

    const notification = await createNoti({
      noti_type: type,
      noti_content: content,
      noti_options: options,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
    });

    if (!notification) {
      throw new BadRequestError("Create Noti failed");
    }

    return notification;
  }

  static async getListNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
    console.log({userId, type});
    const match = {
      noti_receivedId: userId,
    };
    if (type !== "ALL") {
      match["noti_type"] = type;
    }

    return await notificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receivedId: 1,
          noti_content: {
            $concat: [
              {
                $substr: ["$noti_options.shop_name", 0, -1],
              },
              " Vừa mới thêm một sản phẩm mới: ", // language
              {
                $substr: ["$noti_options.product_name", 0, -1],
              },
            ],
          },
          createAt: 1,
          noti_options: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
