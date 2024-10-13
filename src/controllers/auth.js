"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const User = require("../models/user");
const { CustomError } = require("../errors/customError");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  clearTokenCookie,
  verifyToken,
  generateTokenAndSetCookie,
  generateResetToken,
} = require("../utils/generateToken");
const otpGenerator = require("otp-generator");
const {
  sendWelcomeEmail,
  sendPasswordResetRequestEmail,
} = require("../configs/email/verificationEmail/verificationEmail");

module.exports = {
  verifyEmail: async (req, res) => {
    const { code } = req.body;
    try {
      const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).send({
          error: true,
          message: "Verification code is invalid or expired.",
        });
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      await sendWelcomeEmail(user._id, user.email, user.firstName, user._id);

      res.status(200).send({
        error: false,
        message: "Email verified successfully!",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      console.log("error in verifyEmail", error.message, error.stack);
      res.status(500).send({
        error: true,
        message: "Server error",
      });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send({
          error: true,
          message: "User not found",
        });
      }

      const resetToken = generateResetToken({ userId: user._id });
      const resetTokenExpiresAt = Date.now() + 2 * 60 * 1000; // 2m

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
      await user.save();

      // send email
      await sendPasswordResetRequestEmail(
        user.email,
        user.firstName,
        `${process.env.BASE_URL}/reset-password/${resetToken}`
      );
      return res.status(200).send({
        error: false,
        message: "Password reset email sent successfully.",
      });
    } catch (error) {
      console.log("error in reset Password", error.message, error.stack);
    }
  },
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with email and password for get JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */

    const { username, email, password } = req.body;

    if (!password || !(username || email)) {
      throw new CustomError("Please provide both email and password.", 401);
    }

    const user = await User.findOne({ $or: [{ username }, { email }] }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).send({
        error: true,
        message:
          "User not found. Please check your email or password and try again.",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send({
        error: true,
        message:
          "Incorrect password. Please check your password and try again.",
      });
    }
    if (!user.isActive) {
      return res.status(401).send({
        error: true,
        message: "This account is inactive",
      });
    }

    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
    };
    user.lastLogin = new Date();

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Write AccessToken to cookie
    generateTokenAndSetCookie(res, accessToken);

    res.status(200).send({
      error: false,
      message: "Logged in successfully",
      bearer: {
        access: accessToken,
        refresh: refreshToken,
      },
      user,
    });
  },
  refresh: async (req, res) => {
    const refreshToken = req.body?.bearer?.refresh;

    if (!refreshToken) {
      throw new CustomError("Please enter refresh token!", 401);
    }

    try {
      const refreshData = verifyToken(refreshToken, process.env.REFRESH_KEY);

      const user = await User.findOne({ _id: refreshData.userId });

      if (!user) {
        throw new CustomError("User not found!", 401);
      }

      // Create new accessToken
      const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        role: user.role,
      };

      const newAccessToken = generateAccessToken(payload);

      // return newAccessToken
      res.status(200).send({
        error: false,
        bearer: {
          access: newAccessToken,
        },
      });
    } catch (error) {
      throw new CustomError("Invalid or expired refresh token!", 401);
    }
  },

  generateOTP: async (req, res) => {
    let OTP = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    res.status(200).send({
      error: false,
      message: "OTP sent successfully to your email",
    });
  },
  verifyOTP: async (req, res) => {
    res.status(200).send({
      error: false,
      message: "OTP verified successfully",
    });
  },
  createResetSession: async (req, res) => {
    res.status(200).send({
      error: false,
      message: "Reset session created successfully",
    });
  },
  resetPassword: async (req, res) => {
    res.status(200).send({
      error: false,
      message: "Password reset successfully",
    });
  },
  logout: async (req, res) => {
    res.clearCookie("sessionId");
    res.status(200).send({
      error: false,
      message: "User successfully logged out",
    });
    return res.status(200).send({
      error: false,
      message: "Logged out successfully",
    });
  },
  unsubscribe: async (req, res) => {
    const { token } = req.params;
    try {
      const user = await User.findOne({
        unsubscribeToken: token,
        unsubscribeTokenExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).send({
          error: true,
          message: "Unsubscribe link is invalid or expired.",
        });
      }

      // Mark the user as unsubscribed
      user.isSubscribed = false;
      user.unsubscribeToken = undefined;
      user.unsubscribeTokenExpiresAt = undefined;

      await user.save();

      res.status(200).send({
        error: false,
        message: "You have been successfully unsubscribed from emails.",
      });
    } catch (error) {
      res.status(500).send({
        error: true,
        message:
          "An error occurred while unsubscribing. Please try again later.",
      });
    }
  },
};
