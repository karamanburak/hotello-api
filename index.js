"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const express = require("express");
const app = express();

/* ------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                               CONFIGURATIONS                             */
/* -------------------------------------------------------------------------- */
require("dotenv").config();
const PORT = process.env.PORT || 8000;

require("express-async-errors");

const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* -------------------------------------------------------------------------- */
/*                               MIDDLEWARES                                  */
/* -------------------------------------------------------------------------- */
app.use(express.json());

app.use(require("./src/middlewares/findSearchSortPagi"));

/* -------------------------------------------------------------------------- */
/*                               ROUTES                                       */
/* -------------------------------------------------------------------------- */

app.all("/", (req, res) => {
  res.send("<h1>Welcome to the Hotel API</h1>");
});

app.use("/rooms", require("./src/routes/roomRouter"));
/* ------------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log(`App running on port ${PORT}`));

/* ------------------------------------------------------- */
