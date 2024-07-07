"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

// app.use(authentication);

/* -------------------------------------------------------------------------- */
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");

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
      console.log(tokenData);

      req.user = tokenData ? tokenData.userId : undefined;
    } else if (tokenKey[0] == "Bearer") {
      // JWT
      jwt.verify(tokenKey[1], process.env.JWT_SECRET, (error, data) => {
        req.user = data;
      });
    }
  }

  next();
};
