"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const router = require("express").Router();
const facility = require("../controllers/facility");
const { isAdmin } = require("../middlewares/permissions");
const idValidation = require("../middlewares/idValidation");

/* ------------------------------------------------------- */

router.route("/").get(facility.list).post(isAdmin, facility.create);
router
  .route("/:id")
  .all(idValidation)
  .get(facility.read)
  .put(isAdmin, facility.update)
  .patch(isAdmin, facility.update)
  .delete(isAdmin, facility.delete);

/* ------------------------------------------------------- */
module.exports = router;
