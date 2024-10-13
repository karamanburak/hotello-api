const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.ACCESS_EXP || "1h",
  });
  res.cookie("sessionId", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  return token;
};

module.exports = { generateTokenAndSetCookie };
