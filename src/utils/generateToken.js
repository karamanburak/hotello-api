const jwt = require("jsonwebtoken");
const { CustomError } = require("../errors/customError");
const { promisify } = require("util");

// Function to generate a JWT token
const generateToken = (payload, secretKey, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

// Function to verify a JWT token
const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return reject(
            new CustomError("Token has expired. Please log in again.", 401)
          );
        }
        console.log("Error in verifyToken:", error);
        return reject(new CustomError("Invalid token.", 401));
      }
      resolve(decoded);
    });
  });
};

// Function to generate a 6-digit verification code
const generateVerificationCode = (length = 6) => {
  const characters = "0123456789"; // Only digits for the verification code
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Function to create an Access Token
const generateAccessToken = (payload) => {
  return generateToken(
    payload,
    process.env.ACCESS_KEY,
    process.env.ACCESS_EXP || "1d" // Default expiration is 1 day
  );
};

// Function to create a Refresh Token
const generateRefreshToken = (payload) => {
  return generateToken(
    payload,
    process.env.REFRESH_KEY,
    process.env.REFRESH_EXP || "1d" // Default expiration is 1 day
  );
};

// Function to create a Reset Token (e.g., for password reset)
const generateResetToken = (userId) => {
  return generateToken(
    { userId },
    process.env.RESET_KEY,
    process.env.RESET_EXP || "3m"
  );
};

// Function to write the token to a cookie
const generateTokenAndSetCookie = (res, token) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 60 * 60 * 1000, // 1 hour
  };

  res.cookie("sessionId", token, defaultOptions);
};

// Function to read the token from cookies
const getTokenFromCookies = (req) => {
  return req.cookies.sessionId; // Access the sessionId cookie
};

// Function to remove the token from a cookie
const clearTokenCookie = (res) => {
  res.clearCookie("sessionId", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken,
  generateVerificationCode,
  generateTokenAndSetCookie,
  getTokenFromCookies,
  clearTokenCookie,
};
