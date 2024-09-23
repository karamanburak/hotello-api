"use strict";

/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */

const Payment = require("../models/payment");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Payments"]
            #swagger.summary = "List Payments"
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

    const payments = await res.getModelList(Payment);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Payment),
      results: payments.length,
      data: payments,
    });
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Payments"]
            #swagger.summary = "Create Payment"
               #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema: {
        reservationId: savedReservations[0]._id, 
        paymentMethod: "Credit Card",
        status: "Completed",
      },
  }
        */

    const newPayment = await Payment.create(req.body);
    res.status(201).send({
      error: false,
      data: newPayment,
      message: "Payment created successfully",
    });
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Payments"]
            #swagger.summary = "Get Single Payment"
        */
    const payment = await Payment.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data: payment,
    });
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Payments"]
            #swagger.summary = "Update Payment"
              in: "body",
      required : true,
      schema: {
        reservationId: savedReservations[0]._id, 
        paymentMethod: "Credit Card",
        status: "Pendng",
      },
  }
        */
    const payment = await Payment.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data: payment,
      new: await Payment.findOne({ _id: req.params.id }),
      message: "Payment updated successfully",
    });
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Payments"]
            #swagger.summary = "Delete Payment"
        */
    const payment = await Payment.deleteOne({ _id: req.params.id });
    res.status(payment.deletedCount > 0 ? 204 : 404).send({
      error: !payment.deletedCount,
      data: payment,
      message: "Payment deleted successfully",
    });
  },
};
