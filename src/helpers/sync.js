"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

// SYCHRONIZATION:

const mongoose = require("mongoose");
const User = require("../models/user");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const Review = require("../models/reviewModel");

module.exports = async function () {
  try {
    // Reset the database
    await mongoose.connection.dropDatabase();
    console.log("- Database and all data DELETED!");

    /* Rooms */
    const rooms = [
      {
        roomNumber: 101,
        image: "room101.jpg",
        bedType: "Small Bed",
        price: 100,
      },
      {
        roomNumber: 102,
        image: "room102.jpg",
        bedType: "Medium Bed",
        price: 150,
      },
      {
        roomNumber: 103,
        image: "room103.jpg",
        bedType: "Large Bed",
        price: 200,
      },
    ];

    for (const roomData of rooms) {
      try {
        await Room.create(roomData);
        console.log(`- Room ${roomData.roomNumber} Added.`);
      } catch (err) {
        console.error("Error adding room:", err);
      }
    }

    /* Users */
    const users = [
      { username: "user1", password: "Password1!", email: "user1@example.com" },
      { username: "user2", password: "Password2!", email: "user2@example.com" },
    ];

    for (const userData of users) {
      try {
        await User.create(userData);
        console.log(`- User ${userData.username} Added.`);
      } catch (err) {
        console.error("Error adding user:", err);
      }
    }

    /* Reservations */
    const reservations = [
      {
        userId: (await User.findOne({ username: "user1" }))._id,
        roomId: (await Room.findOne({ roomNumber: 101 }))._id,
        arrivalDate: new Date("2024-08-11"),
        departureDate: new Date("2024-08-15"),
        guestNumber: 2,
        night: 4,
        price: 100,
        totalPrice: 400,
      },
      {
        userId: (await User.findOne({ username: "user2" }))._id,
        roomId: (await Room.findOne({ roomNumber: 102 }))._id,
        arrivalDate: new Date("2024-08-01"),
        departureDate: new Date("2024-08-05"),
        guestNumber: 3,
        night: 4,
        price: 150,
        totalPrice: 600,
      },
    ];

    for (const reservationData of reservations) {
      try {
        await Reservation.create(reservationData);
        console.log(`- Reservation for User ${reservationData.userId} Added.`);
      } catch (err) {
        console.error("Error adding reservation:", err);
      }
    }

    /* Reviews */
    const reviews = [
      {
        userId: (await User.findOne({ username: "user1" }))._id,
        hotelId: (await Hotel.findOne({ name: "Hotel A" }))._id,
        rating: 5,
        comment: "Amazing stay! Highly recommend.",
      },
      {
        userId: (await User.findOne({ username: "user2" }))._id,
        hotelId: (await Hotel.findOne({ name: "Hotel B" }))._id,
        rating: 4,
        comment: "Great location but rooms could be cleaner.",
      },
    ];

    for (const reviewData of reviews) {
      try {
        await Review.create(reviewData);
        console.log(`- Review from User ${reviewData.userId} Added.`);
      } catch (err) {
        console.error("Error adding review:", err);
      }
    }

    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error during synchronization:", error);
  }
};
