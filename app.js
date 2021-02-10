const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");

const mongoose = require("./config/db.js");
const shorterRoute = require("./router/shorterRouter");
const redirectRoute = require("./router/redirectRouter");
const mainRoute = require("./router/mainRoute");
const resFormat = require("./helper/response");
const { parse } = require("dotenv");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//tester
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Shorter Link",
    ver: "2.0.0",
  });
});

//for handle shorter process
//user sides
app.use("/", mainRoute);
app.use("/shorter", shorterRoute);
app.use("/", redirectRoute);

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
app.listen(process.env.PORT, () => {
  console.log(
    "Magic at http://" + process.env.HOST_RUN + ":" + process.env.PORT
  );
});
