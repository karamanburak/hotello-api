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
const { idIsValid } = require("../middlewares/idValidation");

/* ------------------------------------------------------- */

router.route("/").get(review.list).post(isLogin, review.create);

router
  .route("/:id")
  .all(idIsValid)
  .get(review.read)
  .put(isLogin, canManageReview, review.update)
  .patch(isLogin, canManageReview, review.update)
  .delete(isLogin, canManageReview, review.delete);

/* ------------------------------------------------------- */
module.exports = router;
