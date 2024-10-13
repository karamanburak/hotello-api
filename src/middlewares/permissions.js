"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const { CustomError } = require("../errors/customError");
const Payment = require("../models/payment");
const Reservation = require("../models/reservation");
const Review = require("../models/review");

module.exports = {
  // Check if the user is logged in
  isLogin: (req, res, next) => {
    if (req.user && req.user.isActive) {
      next();
    } else {
      throw new CustomError("NoPermission: You must log in!", 403);
    }
  },

  isActive: (req, res, next) => {
    if (req.user && req.user.isActive) {
      next();
    } else {
      throw new CustomError("NoPermission: Your account is inactive!", 403);
    }
  },

  // Check if the user is an Admin
  isAdmin: (req, res, next) => {
    if (
      req.user &&
      req.user.isActive &&
      req.user?.role?.toLowerCase() === "admin"
    ) {
      next();
    } else {
      throw new CustomError(
        "NoPermission: You must log in and be an Admin!",
        403
      );
    }
  },

  isLoginAdmin: (req, res, next) => {
    if (
      req.user &&
      req.user?.isActive &&
      req.user?.role?.toLowerCase() === "admin"
    ) {
      next();
    } else {
      throw new CustomError(
        "NoPermission: You must login and to be Admin.",
        403
      );
    }
  },

  // Allow users to access only their own data
  isSelf: async (req, res, next) => {
    const payment = await Payment.findById(req.params.id).populate(
      "reservationId"
    );
    if (!payment) {
      throw new CustomError("Payment not found", 404);
    }
    if (
      req.user &&
      req.user._id.toString() === payment.reservationId.userId.toString()
    ) {
      next();
    } else {
      throw new CustomError(
        "NoPermission: You do not have permission to access this resource!",
        403
      );
    }
  },

  // Check if the user has permission to manage a reservation
  canManageReservation: async (req, res, next) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new CustomError("Reservation not found", 404);
    }
    // console.log(req.user);

    if (
      req.user &&
      (req.user?.role?.toLowerCase() === "admin" ||
        req.user._id === reservation.userId.toString())
    ) {
      next();
    } else {
      throw new CustomError(
        "NoPermission: You are not allowed to manage this reservation!",
        403
      );
    }
  },

  // Check if the user has permission to manage a review
  canManageReview: async (req, res, next) => {
    const review = await Review.findById(req.params.id); // Get the review document
    if (!review) {
      throw new CustomError("Review not found", 404);
    }

    // Compare the review's userId with the logged-in user's ID
    // console.log(req.user);
    if (
      req.user &&
      (req.user?.role?.toLowerCase() === "admin" ||
        req.user._id === review.userId.toString())
    ) {
      next(); // User has permission
    } else {
      throw new CustomError(
        "NoPermission: You are not allowed to manage this review!",
        403
      );
    }
  },
};
