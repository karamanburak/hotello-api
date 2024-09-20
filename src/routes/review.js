"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const router = require("express").Router();
const review = require("../controllers/review");
const {
  isLogin,
  isAdmin,
  canManageReview,
} = require("../middlewares/permissions");
const idValidation = require("../middlewares/idValidation");

/* ------------------------------------------------------- */

router.route("/").get(review.list).post(isLogin, review.create);

router
  .route("/:id")
  .all(idValidation)
  .get(review.read)
  .put(isLogin, canManageReview, review.update)
  .patch(isLogin, canManageReview, review.update)
  .delete(isLogin, isAdmin, canManageReview, review.delete);

/* ------------------------------------------------------- */
module.exports = router;
