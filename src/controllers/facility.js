"use strict";

/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */

const Facility = require("../models/facility");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Facilities"]
            #swagger.summary = "List Facilities"
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

    const facilities = await res.getModelList(Facility);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Facility),
      data: facilities,
    });
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Facilities"]
            #swagger.summary = "Create Facility"
               #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema:{
        name: "Swimming Pool",
        description:
          "Olympic-size pool with lounge chairs and poolside service.",
        availability: true,
        hours: {
          open: "6:00 AM",
          close: "10:00 PM",
        },
  }
        */

    const newFacility = await Facility.create(req.body);
    res.status(201).send({
      error: false,
      data: newFacility,
      message: "Facility created successfully!",
    });
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Facilities"]
            #swagger.summary = "Get Single Facility"
        */

    const facility = await Facility.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data: facility,
    });
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Facilities"]
            #swagger.summary = "Update Facility"
                             #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema:{
        name: "Swimming Pool",
        description:
          "Olympic-size pool with lounge chairs and poolside service.",
        availability: true,
        hours: {
          open: "8:00 AM",
          close: "14:00 PM",
        },
  }
        */

    const facility = await Facility.updateOne(
      { _id: req.params.id },
      req.body,
      {
        runValidators: true,
      }
    );
    res.status(202).send({
      error: false,
      facility,
      new: await Facility.findOne({ _id: req.params.id }),
      message: "Facility updated successfully!",
    });
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Facilities"]
            #swagger.summary = "Delete Facility"
        */

    const facility = await Facility.deleteOne({ _id: req.params.id });
    res.status(facility.deletedCount > 0 ? 204 : 404).send({
      error: !facility.deletedCount,
      data: facility,
      message: "Facility not found!",
    });
  },
};
