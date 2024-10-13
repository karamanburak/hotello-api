const jwt = require("jsonwebtoken");
const { CustomError } = require("../errors/customError");

// Function to generate a JWT token
const generateToken = (payload, secretKey, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

// Function to verify a JWT token
const verifyToken = async (token, secretKey) => {
  try {
    const decoded = await promisify(jwt.verify)(token, secretKey);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new CustomError("Token has expired. Please log in again.", 401);
    } else {
      throw new CustomError("Invalid token.", 401);
    }
  }
};

// Function to create an Access Token
const generateAccessToken = (payload) => {
  return generateToken(
    payload,
    process.env.ACCESS_KEY,
    process.env.ACCESS_EXP || "1h" // Default expiration is 1 day
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

// Function to write the token to a cookie
const setTokenCookie = (res, token, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV !== "development" ? "None" : "Lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 60 * 1000, // 1h
    // maxAge: 5000, // 5s
    path: "/",
    ...options,
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
  verifyToken,
  setTokenCookie,
  getTokenFromCookies,
  clearTokenCookie,
};
