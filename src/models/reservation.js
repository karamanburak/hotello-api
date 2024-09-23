"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const { CustomError } = require("../errors/customError");
/* ------------------------------------------------------- */

const ReservationSchema = new mongoose.Schema(
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
      unique: true,
    },
    checkIn: {
      type: Date,
      required: true,
      trim: true,
    },
    checkOut: {
      type: Date,
      required: true,
      trim: true,
    },
    totalPrice: {
      type: Number,
      // get: function () {
      //   return this.night * this.price;
      // },
    },
    guestAdults: {
      type: Number,
      required: true,
      default: 1,
    },
    guestChildren: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    collection: "reservations",
    timestamps: true,
    // toJSON: { getters: true },
  }
);
ReservationSchema.pre("save", async function (next) {
  const oneDay = 24 * 60 * 60 * 1000;

  // Normalize and trim dates, set them to UTC start of the day
  this.checkIn = new Date(
    Date.UTC(
      this.checkIn.getFullYear(),
      this.checkIn.getMonth(),
      this.checkIn.getDate()
    )
  );
  this.checkOut = new Date(
    Date.UTC(
      this.checkOut.getFullYear(),
      this.checkOut.getMonth(),
      this.checkOut.getDate()
    )
  );
  const nights = Math.round(
    (this.checkOut.getTime() - this.checkIn.getTime()) / oneDay
  );

  const room = await mongoose.model("Room").findById(this.roomId);

  if (!room) {
    return next(new CustomError("Room not found"));
  }

  this.totalPrice = nights * room.pricePerNight;

  next();
});

ReservationSchema.pre("updateOne", async function (next) {
  const updateData = this.getUpdate();

  if (updateData.checkIn && updateData.checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round(
      (new Date(updateData.checkOut).getTime() -
        new Date(updateData.checkIn).getTime()) /
        oneDay
    );

    const reservation = await this.model.findOne(this.getQuery());
    const room = await mongoose.model("Room").findById(reservation.roomId);

    if (!room) {
      return next(new CustomError("Room not found"));
    }

    this.set({ totalPrice: nights * room.pricePerNight });
  }

  // Check room availability for the given dates
  const conflictingReservation = await mongoose.model("Reservation").findOne({
    roomId: updateData.roomId,
    $or: [
      {
        checkIn: { $lt: updateData.checkOut },
        checkOut: { $gt: updateData.checkIn },
      },
    ],
  });

  if (conflictingReservation) {
    return next(new CustomError("Room is already booked for these dates"));
  }

  next();
});

module.exports = mongoose.model("Reservation", ReservationSchema);
