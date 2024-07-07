"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const ResevationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
      trim: true,
    },
    departureDate: {
      type: String,
      required: true,
      trim: true,
    },
    guestNumber: {
      type: Number,
      required: true,
    },
    night: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: String,
      required: true,
      default: 0,
    },
  },
  {
    collection: "reservations",
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", ResevationSchema);
