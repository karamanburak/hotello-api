"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
const user = require("../controllers/user");
const idValidation = require("../middlewares/idValidation");
const permissions = require("../middlewares/permissions");
const upload = require("../middlewares/upload");

router
  .route("/")
  .get(permissions.isAdmin, user.list)
  .post(upload.array("avatar"), user.create);

router
  .route("/:id")
  .all(idValidation, permissions.isLogin)
  .get(user.read)
  .put(upload.array("avatar"), user.update)
  .patch(upload.array("avatar"), user.update)
  .delete(permissions.isAdmin, user.delete);

/* ------------------------------------------------------- */
module.exports = router;
