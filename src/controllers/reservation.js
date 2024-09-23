"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const Reservation = require("../models/reservation");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "List Reservartions"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
    let customFilter = {};
    if (!req.user.isAdmin) {
      customFilter = { userId: req.user._id };
    }
    const reservations = await res.getModelList(Reservation, customFilter, [
      "userId",
      "roomId",
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation),
      results: reservations.length,
      data: reservations,
    });
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Create Reservation"
               #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema:{
    "userId":"668fd96247f6e64488d96335",
    "roomId":"668fda202926db85c1068371",
    "arrivalDate": "2024-07-11   ",
    "departureDate":"    2024-07-15",
    "guestNumber":2,
    "price":50
        }
  }
        */

    const newReservation = await Reservation.create(req.body);
    res.status(201).send({
      error: false,
      data: newReservation,
      message: "Reservation created successfully!",
    });
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Get Single Reservation"
        */
    const reservation = await Reservation.findOne({
      _id: req.params.id,
    }).populate([{ path: "userId" }, { path: "roomId" }]);
    res.status(200).send({
      error: false,
      data: reservation,
    });
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Update Reservation"
                             #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema:{
    "arrivalDate": "2024.07.15",
    "departureDate": "2024.07.20",
    "guestNumber": 2,
    "price":49
        }
  }
        */
    const reservation = await Reservation.updateOne(
      { _id: req.params.id },
      req.body,
      { runValidators: true }
    );
    res.status(202).send({
      error: false,
      data: reservation,
      new: await Reservation.findOne({ _id: req.params.id }),
      message: "Reservation not found!",
    });
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Delete Reservation"
        */
    const reservation = await Reservation.deleteOne({ _id: req.params.id });
    res.status(reservation.deletedCount > 0 ? 204 : 404).send({
      error: !reservation.deletedCount,
      data: reservation,
      message: "Reservation not found!",
    });
  },
};
