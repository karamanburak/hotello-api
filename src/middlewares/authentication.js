"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

// app.use(authentication);

/* -------------------------------------------------------------------------- */
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
/* -------------------------------------------------------------------------- */

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization;
  const tokenKey = auth ? auth.split(" ") : null;

  if (tokenKey && tokenKey[0] == "Bearer") {
    try {
      //* Promisify jwt.verify to use async/await:
      const verify = promisify(jwt.verify);
      const accessData = await verify(tokenKey[1], process.env.ACCESS_KEY);
      console.log("JWT verified");
      req.user = accessData;
    } catch (error) {
      console.log("JWT not verified!");
      req.user = false;
      console.log(error);
    }
  } else {
    req.user = false; // Ensure req.user is false if no Bearer token is provided
  }

  next();
};
