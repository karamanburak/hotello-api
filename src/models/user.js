"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

/* ------------------------------------------------------- */

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "staff", "admin"],
      default: "user",
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      select: false,
      set: function (password) {
        if (validator.isStrongPassword(password)) {
          return password;
        } else {
          throw new CustomError("Password type is incorrect!", 400);
        }
      },
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    avatar: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSubscribe: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    collection: "users",
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

UserSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.resetPasswordToken);

  this.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
