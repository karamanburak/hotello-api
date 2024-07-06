"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();
const reservation = require("../controllers/reservationController");
/* ------------------------------------------------------- */

router.route("/").get(reservation.list).post(reservation.create);
router
  .route("/:id")
  .get(reservation.read)
  .put(reservation.update)
  .patch(reservation.update)
  .delete(reservation.delete);

/* ------------------------------------------------------- */
module.exports = router;
