"use strict";

const { BadRequestError } = require("../core/error.response");
const { Created, OK } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    new Created({
      metadata: await UploadService.uploadImageFromUrl(req.body),
    }).send(res);
  };
  uploadImageFromLocal = async (req, res, next) => {
    const { file } = req;

    if (!file) {
      throw new BadRequestError("File missing!");
    }

    new Created({
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
}
module.exports = new UploadController();
