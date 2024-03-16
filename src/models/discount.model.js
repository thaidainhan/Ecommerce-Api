"use strict";
const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
    },
    discount_type: {
      type: String,
      default: "fixed_amount",
      enum: ["fixed_amount", "percentage_amount"],
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    },
    discount_uses_count: {
      // so discount da su dung
      type: Number,
      required: true,
    },
    discount_users_used: {
      //  ai da su dung
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      //  so luong toi da dc su dung cua moi user
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      //  so luong toi da dc su dung cua moi user
      type: Number,
      required: true,
    },

    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },

    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"]
    },
    discount_product_ids: {
      //  cac san pham duoc ap dung
      type: Array,
      default: [],
    }, 
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
