"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const Room = require("../models/roomModel");

module.exports = {
  list: async (req, res) => {
    const rooms = await res.getModelList(Room);
    res.status(200).send({
      error: false,
      detail: await res.getModelListDetails(Room),
      results: rooms.length,
      rooms,
    });
  },
  create: async (req, res) => {
    const newRoom = await Room.create(req.body);
    res.status(201).send({
      error: false,
      newRoom,
    });
  },
  read: async (req, res) => {
    // const rooms = await Room.findOne({_id:req.params.id})
    const room = await Room.findById(req.params.id); // mongoose arka planda findOne methodunu calistirir.
    res.status(200).send({
      error: false,
      room,
    });
  },
  update: async (req, res) => {
    const room = await Room.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      room,
      updatedRoom: await Room.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    const room = await Room.deleteOne({ _id: req.params.id });
    res.status(room.deletedCount > 0 ? 204 : 404).send({
      error: !room.deletedCount,
      room,
    });
  },
};
