"use strict";
/* -------------------------------------------------------
EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();

router.use("/auth", require(".//authRouter"));
router.use("/tokens", require("./tokenRouter"));
router.use("/rooms", require("./roomRouter"));
router.use("/users", require("./userRouter"));
router.use("/reservations", require("./reservationRouter"));

/*------------------------------------------------------- */
module.exports = router;
