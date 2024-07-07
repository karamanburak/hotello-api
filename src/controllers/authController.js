"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

// const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      const user = await User.findOne({ email, password });
      if (user && user.isActive) {
        //* User a ait token var mi kontrol et.
        let tokenData = await Token.findOne({ userId: user._id });

        //* Token yoksa actif user icin yeni bir token olustur.
        if (!tokenData) {
          const tokenKey = passwordEncrypt(user._id + Date.now());

          tokenData = await Token.create({ userId: user._id, token: tokenKey });
        }

        res.status(200).send({
          error: false,
          token: tokenData.token,
          user,
        });
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong Email or Password");
      }
    } else {
      res.errorStatusCode = 400;
      throw new Error("Email or Password required!");
    }
  },
  logout: async (req, res) => {},
};
