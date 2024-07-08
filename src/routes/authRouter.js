"use strict";
/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */

const router = require("express").Router();

const auth = require("../controllers/authController");

//^ URL => "/auth"

router.post("/login", auth.login);
router.get("/logout", auth.logout);

module.exports = router;
