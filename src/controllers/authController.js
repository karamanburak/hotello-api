"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

// const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../errors/customError");

module.exports = {
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with email and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */
    const { username, email, password } = req.body;

    if (password && (username || email)) {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (user && user.password == passwordEncrypt(password)) {
        if (user.isActive) {
          let tokenData = await Token.findOne({ userId: user._id }); // Bu user'a ait token var mi yok mu kontrol et varsa olani döndürür.
          if (!tokenData) {
            // usera ait token bilgisi yoksa yenisini olustur
            tokenData = await Token.create({
              userId: user._id,
              token: passwordEncrypt(user._id + Date.now()),
            });
          }
          res.status(200).send({
            error: false,
            token: tokenData.token,
            user,
          });
        } else {
          throw new CustomError("This account is in active", 401);
        }
      } else {
        throw new CustomError("Wrong username/email or password!", 401);
      }
    } else {
      throw new CustomError("Please enter username/email and password", 401);
    }
  },
  logout: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "simpleToken: Logout"
            #swagger.description = 'Delete token key.'
        */
    // 1. yöntem (Tüm otturumlari kapatir yani tüm tokenlari siler)
    // const deleted = await Token.deleteOne({ userId: req.user._id });

    // res.status(deleted.deletedCount > 0 ? 200 : 404).send({
    //   error: !deleted.deletedCount,
    //   deleted,
    //   message: deleted.deletedCount > 0 ? "Logout OK" : "Logout Failed!",
    // });
    // console.log(req.user);

    // 2. yöntem (Tüm otturumlari kapatir yani tüm tokenlari siler)
    // const deleted = await Token.deleteMany({ userId: req.user._id });
    // console.log(req.user);

    //3. yöntem (Tek bir oturumu kapatir yani tek bir tokeni siler)
    const auth = req.headers?.authorization || null;
    const tokenKey = auth ? auth.split(" ") : null;

    let deleted = null;
    if (tokenKey && tokenKey[0] == "Token") {
      deleted = await Token.deleteOne({ token: tokenKey[1] });
    }

    res.status(deleted.deletedCount > 0 ? 200 : 404).send({
      error: !deleted.deletedCount,
      deleted,
      message: deleted.deletedCount > 0 ? "Logout OK" : "Logout Failed!",
    });
  },
};
