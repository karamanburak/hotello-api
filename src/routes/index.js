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
// router.use("/tokens", require("./tokenRouter"));
// room:
router.use("/rooms", require("./room"));
// reservation:
router.use("/reservations", require("./reservation"));
// document:
router.use("/documents", require("./documents"));

/*------------------------------------------------------- */
module.exports = router;
