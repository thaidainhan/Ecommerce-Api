"use strict";

const { SuccessReponse } = require("../core/success.response");

const dataProfiles = [
  {
    user_id: 1,
    user_name: "cr7",
    user_avatar: "image-1",
  },
  {
    user_id: 2,
    user_name: "m10",
    user_avatar: "image-2",
  },
  {
    user_id: 3,
    user_name: "kenji",
    user_avatar: "image-3",
  },
];

class ProfileController {
  // admin
  profiles = async (req, res, next) => {
    new SuccessReponse({
      message: "view all profiles",
      metadata: dataProfiles,
    }).send(res);
  };

  //   shop
  profile = async (req, res, next) => {
    new SuccessReponse({
      message: "view one profile",
      metadata: dataProfiles[1],
    }).send(res);
  };
}

module.exports = new ProfileController();
