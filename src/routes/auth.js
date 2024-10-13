"use strict";
/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */

const router = require("express").Router();
const auth = require("../controllers/auth");

//^ URL => "/auth"

router.post("/login", auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);
// router.post("/registerMail");

router.get("/generateOTP", auth.generateOTP);
router.get("/verifyOTP", auth.verifyOTP);
router.get("/createResetSession", auth.createResetSession);

router.put("/resetPassword", auth.resetPassword);

module.exports = router;
