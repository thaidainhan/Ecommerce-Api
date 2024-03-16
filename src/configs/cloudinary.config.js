// Require the cloudinary library
const { v2: cloudinary } = require("cloudinary");

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDDINARY_API_KEY,
  api_secret: process.env.CLOUDDINARY_API_SECRET,
});

// Log the configuration
console.log(cloudinary.config());

module.exports = cloudinary;
