"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const FacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    hours: {
      type: Object,
      properties: {
        open: { type: String }, // Example: "9:00 AM"
        close: { type: String }, // Example: "5:00 PM"
      },
    },
  },
  {
    collection: "facilities",
    timestamps: true,
  }
);
module.exports = mongoose.model("Facilities", FacilitySchema);
