"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();
const reservation = require("../controllers/reservationController");
const permissions = require("../middlewares/permissions");

/* ------------------------------------------------------- */

router
  .route("/")
  .get(permissions.isAdmin, reservation.list)
  .post(reservation.create);
router
  .route("/:id")
  .get(reservation.read)
  .put(reservation.update)
  .patch(reservation.update)
  .delete(reservation.delete);

/* ------------------------------------------------------- */
module.exports = router;
