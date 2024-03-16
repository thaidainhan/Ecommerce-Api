"use strict";

const cloudinary = require("../configs/cloudinary.config");

class UploadService {
  static async uploadImageFromUrl(imagePath) {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions

    // const options = {
    //   use_filename: true,
    //   unique_filename: false,
    //   overwrite: true,
    // };

    const urlImage =
      "https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg";
    const folderName = "product/9999";
    const newFileName = "testd";

    try {
      // Upload the image
      const res = await cloudinary.uploader.upload(urlImage, {
        folder: folderName,
        public_id: newFileName,
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  static async uploadImageFromLocal({ path }) {
    const folderName = "product/9999";

    // const options = {
    //   use_filename: true,
    //   unique_filename: false,
    //   overwrite: true,
    // };

    try {
      // Upload the image
      const res = await cloudinary.uploader.upload(path, {
        folder: folderName,
        public_id: "thumb",
      });
      return {
        secure_url: res.secure_url,
        public_id: res.public_id,
        shopId: 9999,
        thumb_url: await cloudinary.url(res.public_id, {
          width: 100,
          height: 100,
          format: "jpg",
        }),
      };
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UploadService;
