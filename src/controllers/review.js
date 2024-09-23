"use strict";

/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */

const Review = require("../models/review");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Reviews"]
            #swagger.summary = "List Reviews"
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

    const reviews = await res.getModelList(Review, {}, "userId");
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Review),
      results: reviews.length,
      data: reviews,
    });
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Reviews"]
            #swagger.summary = "Create Review"
               #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema:{
        userId: await User.findOne({ username: "user1" }),
        rating: 5,
        comment: "Amazing stay! Highly recommend.",
      },
  }
        */
    const newReview = await (await Review.create(req.body)).populate("userId");
    res.status(201).send({
      error: false,
      data: newReview,
      message: "Review created successfully",
    });
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Reviews"]
            #swagger.summary = "Get Single Review"
        */
    const review = await Review.findById(req.params.id).populate("userId");
    res.status(200).send({
      error: false,
      data: review,
    });
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Reviews"]
            #swagger.summary = "Update Review"
                             #swagger.parameters["body"] = {
      in: "body",
      required : true,
       schema:{
        userId: await User.findOne({ username: "user1" }),
        rating: 3,
        comment: "Cool!",
      },
  }
        */

    const review = await Review.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data: review,
      new: await Review.findOne({ _id: req.params.id }),
      message: "Review updated successfully",
    });
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Reviews"]
            #swagger.summary = "Delete Review"
        */
    const review = await Review.deleteOne({ _id: req.params.id });
    res.status(review.deletedCount > 0 ? 204 : 404).send({
      error: !review.deletedCount,
      message: "Review deleted successfully",
    });
  },
};
