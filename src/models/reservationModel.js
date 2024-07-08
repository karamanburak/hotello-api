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
      type: Date,
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
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      get: function () {
        return this.night * this.price;
      },
    },
  },
  {
    collection: "reservations",
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model("Reservation", ResevationSchema);
