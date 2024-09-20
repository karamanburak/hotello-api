"use strict";
/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();

// auth:
router.use("/auth", require("./auth"));
// user:
router.use("/users", require("./user"));
// token:
// router.use("/tokens", require("./token"));
// room:
router.use("/rooms", require("./room"));
// reservation:
router.use("/reservations", require("./reservation"));
// facility:
router.use("/facilities", require("./facility"));
// document:
router.use("/documents", require("./documents"));

/*------------------------------------------------------- */
module.exports = router;
