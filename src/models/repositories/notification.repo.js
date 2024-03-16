const notificationModel = require("../notification.model");

const createNoti = async ({
  noti_type,
  noti_content,
  noti_options,
  noti_senderId,
  noti_receivedId,
}) => {
  const newNoti = await notificationModel.create({
    noti_type,
    noti_content,
    noti_options,
    noti_senderId,
    noti_receivedId,
  });
  return newNoti;
};

module.exports = {
  createNoti,
};
