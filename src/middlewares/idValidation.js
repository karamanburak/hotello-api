"use strict";

const { mongoose } = require("../configs/dbConnection");
const { CustomError } = require("../errors/customError");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/generateToken");

module.exports = {
  // Check if the user is logged in
  idIsValid: (req, res, next) => {
    const idIsValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!idIsValid) throw new CustomError("Id is not valid!", 400);
    next();
  },

  authChecker: async (req, res, next) => {
    try {
      console.log("Cookies:", req.cookies);
      const token = req.cookies.sessionId;

      if (!token) {
        throw new CustomError("Unauthorized - No token provided!", 401);
      }

      const decoded = await verifyToken(token, process.env.ACCESS_KEY);
      req.userId = decoded.userId;

      next();
    } catch (error) {
      console.log("Error in authChecker:", error.message);
      if (error instanceof CustomError) {
        return res
          .status(error.statusCode)
          .send({ error: true, message: error.message });
      }
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};
