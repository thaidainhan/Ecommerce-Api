"use strict";
const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
      unique: true,
    },
    user_slug: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      default: "",
    },
    user_password: {
      type: String,
      default: "",
    },
    user_salf: {
      type: String,
      default: "",
    },
    user_email: {
      type: String,
      required: true,
    },
    user_phone: {
      type: String,
      default: "",
    },
    user_sex: {
      type: String,
      default: "",
    },
    user_avatar: {
      type: String,
      default: "",
    },
    user_date_of_birth: {
      type: Date,
      default: null,
    },
    user_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    user_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
