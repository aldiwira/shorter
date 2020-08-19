const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const bodyparse = require("body-parser");
const mongoose = require("./config/db.js");
const dotenv = require("dotenv/config");
const shorterRoute = require("./router/shorterRouter");
const redirectRoute = require("./router/redirectRouter");
const mainRoute = require("./router/mainRoute");
const morgan = require("morgan");

app.use(helmet());
app.use(cors());
app.use(bodyparse.json());
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
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected"));

//service handler
app.listen(process.env.PORT, () => {
  console.log(
    "Magic at http://" + process.env.HOST_RUN + ":" + process.env.PORT
  );
});
