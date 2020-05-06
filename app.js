const express = require("express");
const app = express();
const bodyparse = require("body-parser");
const mongoose = require("./config/db.js");
const dotenv = require("dotenv/config");
const shorterRoute = require("./router/shorterRouter");
const redirectRoute = require("./router/redirectRouter");
const mainRoute = require("./router/mainRoute");

app.use(bodyparse.json());
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Shorter Link",
    ver: "0.1.0",
  });
});
//for handle shorter process
app.use("/", mainRoute);
app.use("/shorter", shorterRoute);
app.use("/axios", redirectRoute);

//db checking
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));

//service handler
app.listen(process.env.PORT_RUN || 3000, () => {
  console.log(
    "Magic at http://" + process.env.HOST_RUN + ":" + process.env.PORT_RUN
  );
});
