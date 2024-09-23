"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

// SYCHRONIZATION:

const mongoose = require("mongoose");
const User = require("../models/user");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const Review = require("../models/review");
const Facility = require("../models/facility");
// const Payment = require("../models/payment");

module.exports = async function () {
  try {
    // return null

    // Reset the database
    // await mongoose.connection.dropDatabase();
    // console.log("- Database and all data DELETED!");
    // Reset the database

    /* Rooms */
    const rooms = [
      {
        roomId: 101,
        roomNumber: 101,
        image: "room101.jpg",
        roomType: "Single Room",
        price: 100,
      },
      {
        roomId: 102,
        roomNumber: 102,
        image: "room102.jpg",
        roomType: "Double Room",
        price: 150,
      },
      {
        roomId: 103,
        roomNumber: 103,
        image: "room103.jpg",
        roomType: "Twin Room",
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
      {
        userId: 1,
        username: "user1",
        password: "Password1!",
        isStaff: "false",

        email: "user1@example.com",
      },
      {
        userId: 2,
        username: "user2",
        password: "Password1!",
        isStaff: "true",
        email: "user2@example.com",
      },
      {
        userId: 3,
        username: "admin",
        password: "Password1!",
        email: "admin@example.com",
        isAdmin: "true",
      },
    ];

    for (const userData of users) {
      try {
        await User.create(userData);
        console.log(`- User ${userData.username} Added.`);
      } catch (err) {
        console.error("Error adding user:", err);
      }
    }

    const reservations = [
      {
        userId: await User.findOne({ username: "user1" }),
        roomId: await Room.findOne({ roomNumber: 101 }),
        checkIn: new Date("2024-09-25"),
        checkOut: new Date("2024-09-30"),
        guestAdults: 2,
        guestChildren: 1,
      },
      {
        userId: await User.findOne({ username: "user2" }),
        roomId: await Room.findOne({ roomNumber: 102 }),
        checkIn: new Date("2024-10-10"),
        checkOut: new Date("2024-10-25"),
        guestAdults: 3,
        guestChildren: 2,
      },
    ];
    const savedReservations = [];
    for (const reservationData of reservations) {
      try {
        await Reservation.create(reservationData);
        console.log(`- Reservation for User ${reservationData.userId} Added.`);
      } catch (err) {
        console.error("Error adding reservation:", err);
      }
    }

    /* Payments */
    // const payments = [
    //   {
    //     reservationId: savedReservations[0]._id, // Link to the first reservation
    //     paymentMethod: "Credit Card",
    //     status: "Completed",
    //   },
    //   {
    //     reservationId: savedReservations[1]._id, // Link to the second reservation
    //     paymentMethod: "PayPal",
    //     status: "Pending",
    //   },
    // ];

    // for (const paymentData of payments) {
    //   try {
    //     await Payment.create(paymentData);
    //     console.log(
    //       `- Payment for Reservation ${paymentData.reservationId} Added.`
    //     );
    //   } catch (err) {
    //     console.error("Error adding payment:", err);
    //   }
    // }

    /* Reviews */
    const reviews = [
      {
        userId: await User.findOne({ username: "user1" }),
        rating: 5,
        comment: "Amazing stay! Highly recommend.",
      },
      {
        userId: await User.findOne({ username: "user2" }),
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

    /* Facilities */
    const facilities = [
      {
        name: "Swimming Pool",
        description:
          "Olympic-size pool with lounge chairs and poolside service.",
        availability: true,
        hours: {
          open: "6:00 AM",
          close: "10:00 PM",
        },
      },
      {
        name: "Gym",
        description:
          "State-of-the-art gym with modern equipment and personal trainers available.",
        availability: true,
        hours: {
          open: "5:00 AM",
          close: "11:00 PM",
        },
      },
      {
        name: "Spa",
        description: "Luxury spa offering a range of treatments and services.",
        availability: false, // Currently unavailable for maintenance
        hours: {
          open: "8:00 AM",
          close: "8:00 PM",
        },
      },
    ];

    for (const facilityData of facilities) {
      try {
        await Facility.create(facilityData);
        console.log(`- Facility ${facilityData.name} Added.`);
      } catch (err) {
        console.error("Error adding facility:", err);
      }
    }

    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error during synchronization:", error);
  }
};
