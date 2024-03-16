"use strict";
const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER-001: Success Order
// ORDER-002: Failure Order
// PROMOTION-001: New Promotion
// SHOP-001: New Product By User Following

// Declare the Schema of the Mongo model
const notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    noti_senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    noti_receivedId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
