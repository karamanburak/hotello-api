"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const router = require("express").Router();
const facility = require("../controllers/facility");
const { isLoginAdmin } = require("../middlewares/permissions");
const idValidation = require("../middlewares/idValidation");

/* ------------------------------------------------------- */

router.route("/").get(facility.list).post(isLoginAdmin, facility.create);
router
  .route("/:id")
  .all(idValidation)
  .get(facility.read)
  .put(isLoginAdmin, facility.update)
  .patch(isLoginAdmin, facility.update)
  .delete(isLoginAdmin, facility.delete);

/* ------------------------------------------------------- */
module.exports = router;