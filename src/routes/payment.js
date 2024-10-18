"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();
const payment = require("../controllers/payment");
const { isAdmin, isActive, isSelf } = require("../middlewares/permissions");
const { idIsValid } = require("../middlewares/idValidation");

/* ------------------------------------------------------- */

router.route("/").get(isAdmin, payment.list).post(isActive, payment.create);
router
  .route("/:id")
  .all(idIsValid)
  .get(isSelf, payment.read)
  .put(isSelf, payment.update)
  .patch(isSelf, payment.update)
  .delete(isSelf, payment.delete);

/* ------------------------------------------------------- */
module.exports = router;
