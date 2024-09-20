"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const router = require("express").Router();
const review = require("../controllers/review");
const permissions = require("../middlewares/permissions");
const idValidation = require("../middlewares/idValidation");

/* ------------------------------------------------------- */

router.route("/").get(review.list).post(permissions.isLogin, review.create);

router
  .route("/:id")
  .get(review.read)
  .put(review.update)
  .patch(review.update)
  .delete(review.delete);

/* ------------------------------------------------------- */
module.exports = router;
