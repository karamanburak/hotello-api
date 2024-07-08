"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();
const room = require("../controllers/roomController");
const idValidation = require("../middlewares/idValidation");
const permissions = require("../middlewares/permissions");
/* ------------------------------------------------------- */

router.use(permissions.isLogin);

router.route("/").get(room.list).post(permissions.isAdmin, room.create);
router
  .route("/:id")
  .all(idValidation)
  .get(room.read)
  .put(permissions.isAdmin, room.update)
  .patch(permissions.isAdmin, room.update)
  .delete(room.delete);

/* ------------------------------------------------------- */
module.exports = router;
