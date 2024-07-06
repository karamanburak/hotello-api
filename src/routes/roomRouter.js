"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
const room = require("../controllers/roomController");

router.route("/").get(room.list).post(room.create);
router
  .route("/:id")
  .get(room.read)
  .put(room.update)
  .patch(room.update)
  .delete(room.delete);

/* ------------------------------------------------------- */
module.exports = router;
