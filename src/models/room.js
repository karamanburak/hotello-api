"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const RoomSchema = new mongoose.Schema(
  {
    facilitiesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facilities",
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    roomType: {
      type: String,
      trim: true,
      required: true,
      enum: ["Single Room", "Double Room", "Twin Room"],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    pricePerNight: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 1,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "rooms",
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", RoomSchema);
