"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const Reservation = require("../models/reservationModel");

module.exports = {
  list: async (req, res) => {
    const reservations = await res.getModelList(Reservation);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation),
      results: reservations.length,
      reservations,
    });
  },
  create: async (req, res) => {
    const newReservation = await Reservation.create(req.body);
    res.status(201).send({
      error: false,
      newReservation,
    });
  },
  read: async (req, res) => {
    const reservation = await Reservation.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      reservation,
    });
  },
  update: async (req, res) => {
    const reservation = await Reservation.updateOne(
      { _id: req.params.id },
      req.body,
      { runValidators: true }
    );
    res.status(202).send({
      error: false,
      reservation,
      updatedReservation: await Reservation.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    const reservation = await Reservation.deleteOne({ _id: req.params.id });
    res.status(reservation.deletedCount > 0 ? 204 : 404).send({
      error: !reservation.deletedCount,
      reservation,
    });
  },
};
