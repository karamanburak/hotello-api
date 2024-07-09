"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
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
      // get: function () {
      //   return this.night * this.price;
      // },
    },
  },
  {
    collection: "reservations",
    timestamps: true,
    // toJSON: { getters: true },
  }
);
ReservationSchema.pre("save", function (next) {
  this.totalPrice = this.price * this.night;
  next();
});
ReservationSchema.pre("updateOne", async function (next) {
  // do stuff
  const updateData = this.getUpdate();
  // console.log(updateData);
  let newPrice = updateData.price;
  let newNight = updateData.night;

  if (newPrice || newNight) {
    if (!newPrice || !newNight) {
      const oldData = await this.model.findOne(this.getQuery());
      newPrice = newPrice || oldData.price;
      newNight = newNight || oldData.night;
    }
    this.set({ totalPrice: newPrice * newNight });
  }
  next();
});

module.exports = mongoose.model("Reservation", ReservationSchema);
