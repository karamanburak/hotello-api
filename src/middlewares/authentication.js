"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

// app.use(authentication);

/* -------------------------------------------------------------------------- */
const jwt = require("jsonwebtoken");
const Token = require("../models/token");

/* -------------------------------------------------------------------------- */
module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null;
  const tokenKey = auth ? auth.split(" ") : null;

  if (tokenKey) {
    if (tokenKey[0] == "Token") {
      // SimpleToken:
      const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
        "userId"
      );
      req.user = tokenData ? tokenData.userId : undefined;
    } else if (tokenKey[0] == "Bearer") {
      // JWT
      jwt.verify(tokenKey[1], process.env.ACCESS_KEY, (error, data) => {
        req.user = data;
      });
    }
  }

  next();
};
