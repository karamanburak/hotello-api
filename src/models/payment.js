"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const { CustomError } = require("../errors/customError");
/* ------------------------------------------------------- */

const PaymentSchema = new mongoose.Schema(
  {
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Bank Transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    collection: "payments",
    timestamps: true,
  }
);

// Pre-Save hook to set the amount based on the totalPrice from the realted reservation
PaymentSchema.pre("save", async function (next) {
  if (!this.reservationId) {
    return next(new CustomError("Reservation ID is required", 400));
  }

  // Fetch the associated reservation
  const reservation = await mongoose
    .model("Reservation")
    .findById(this.reservationId);

  if (!reservation) {
    return next(new CustomError("Reservation not found", 400));
  }

  // Set the amount based on the reservation's totalPrice
  this.amount = reservation.totalPrice;

  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);
