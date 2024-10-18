"use strict";
/* -------------------------------------------------------
    EXPRESS - HOTEL API
------------------------------------------------------- */

const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");

/* ------------------------------------------------------- */

//* cron job
// const job = require("./src/helpers/cron");
// console.log("Cron job is being started...");
// // Start the cron job
// job.start();

// CORS
const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Origin", "Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

require("dotenv").config();
const PORT = process.env.PORT || 8000;

require("express-async-errors");

/* -------------------------------------------------------------------------- */
/*                               CONFIGURATIONS                               */
/* -------------------------------------------------------------------------- */

const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* -------------------------------------------------------------------------- */
/*                               MIDDLEWARES                                  */
/* -------------------------------------------------------------------------- */
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use(require("./src/middlewares/queryHandler"));

app.use(require("./src/middlewares/auth"));

app.use(require("./src/middlewares/logging"));
app.use(morgan("dev"));

/* -------------------------------------------------------------------------- */
/*                               ROUTES                                       */
/* -------------------------------------------------------------------------- */

app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to HOTELLO API",
    docs: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
    user: req.user,
  });
});

//* Static root
app.use("/uploads", express.static("./uploads"));

app.use("/", require("./src/routes/"));

app.use((req, res, next) => {
  res.status(404).send({
    error: true,
    message: "Route not found!",
  });
});

/* ------------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log(`App running on http://127.0.0.1:${PORT}`));

/* ------------------------------------------------------- */

// require("./src/helpers/sync")();
