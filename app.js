const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
require("dotenv");

const mongoose = require("./config/db.js");
const resFormat = require("./helper/response");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes init
require("./config/routes")(app);

//db checking
const db = mongoose.connection;
db.on("error", (error) => {
  throw new Error(error.stack);
});
db.once("open", () => console.log("Connected"));

app.use((error, req, res, next) => {
  let status = error.status ? error.status : 400;
  res.status(status).json(resFormat.set(status, error.message, false));
});

//service handler
app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Magic at http://" + process.env.HOST_RUN + ":" + process.env.PORT
  );
});
