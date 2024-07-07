const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res
        .status(400)
        .send({ error: "Please provide an email and a password" });
    }
    // 2) Check if the user exist && password is correct
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    // 3) If everything ok, send jwt to client

    const token = "asd";
    res.status(200).send({
      error: false,
      token,
    });
  },
  logout: async (req, res) => {},
};
