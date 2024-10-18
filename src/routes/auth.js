"use strict";
/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */

const router = require("express").Router();
const {
  login,
  refresh,
  logout,
  generateOTP,
  verifyOTP,
  createResetSession,
  forgotPassword,
  resetPassword,
  verifyEmail,
  unsubscribe,
  checkAuth,
} = require("../controllers/auth");
const { authMiddleware } = require("../middlewares/idValidation");

//^ URL => "/auth"

router.get("/check-auth", authMiddleware, checkAuth);

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/unsubscribe", unsubscribe);

router.get("/generateOTP", generateOTP);
router.get("/verifyOTP", verifyOTP);
router.get("/createResetSession", createResetSession);

module.exports = router;
