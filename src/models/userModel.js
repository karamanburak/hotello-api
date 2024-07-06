"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const validator = require("validator");
/* ------------------------------------------------------- */

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 8,
      // select:false
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      // validate: [
      //     (email) => email.includes("@") && email.split("@")[1].includes("."),
      //     "Email is invalid!",
      // ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "user",
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
