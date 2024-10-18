"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();
const reservation = require("../controllers/reservation");
const {
  isLogin,
  isAdmin,
  canManageReservation,
} = require("../middlewares/permissions");
const { idIsValid } = require("../middlewares/idValidation");

/* ------------------------------------------------------- */

router
  .route("/")
  .get(isAdmin, reservation.list)
  .post(isLogin, reservation.create);
router
  .route("/:id")
  .all(idIsValid)
  .get(isLogin, canManageReservation, reservation.read)
  .put(isLogin, canManageReservation, reservation.update)
  .patch(isLogin, canManageReservation, reservation.update)
  .delete(isLogin, canManageReservation, reservation.delete);

/* ------------------------------------------------------- */
module.exports = router;
