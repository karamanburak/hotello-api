"use strict";
const {
  sendVerificationEmail,
} = require("../configs/email/verificationEmail/verificationEmail");
const {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookie,
} = require("../helpers/generateToken");
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const User = require("../models/user");
const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
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

    const users = await res.getModelList(User);
    res.status(200).send({
      error: false,
      detail: await res.getModelListDetails(User),
      data: users,
    });
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
                             #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema:{
    "username": "user",
    "password": "Password1!",
    "email": "user@example.com",
        }
  }
        */

    const { email, username, firstName, lastName, password } = req.body;

    // Check if the email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).send({
        error: true,
        message: "Email already exists. Please use a different email address.",
      });
    }

    // Check if the username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).send({
        error: true,
        message: "Username already exists. Please use a different username.",
      });
    }

    const verificationToken = Math.floor(
      10000 + Math.random() * 900000
    ).toString();

    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    //JWT
    generateTokenAndSetCookie(res, newUser._id);
    sendVerificationEmail(newUser.email, newUser.firstName, verificationToken);

    res.status(201).send({
      error: false,
      message: "User created successfully!",
      newUser: {
        ...newUser._doc,
        password: undefined,
      },
    });
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      user,
    });
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
                             #swagger.parameters["body"] = {
      in: "body",
      required : true,
      schema:{
    "email":"admin@example.com",
    "role":"admin"
        }
  }
        */
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.send({
      error: false,
      data: user,
      new: await User.findOne({ _id: req.params.id }),
      message: "User updated successfully!",
    });
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */
    const user = await User.deleteOne({ _id: req.params.id });
    res.status(user.deletedCount ? 204 : 404).send({
      error: !user.deletedCount,
      data: user,
      message: "User not found!",
    });
  },
};
