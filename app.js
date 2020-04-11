const express = require("express");
const app = express();
const bodyparse = require("body-parser");
const mongoose = require("./config/db.js");
const dotenv = require("dotenv/config");
const shorterRoute = require("./router/shorterRouter.js");

app.use(bodyparse.json());
app.get("/", (req, res) => {
  res.send("Shorter Link");
});
//for handle shorter process
app.use("/shorter", shorterRoute);

app.listen(process.env.PORT_RUN || 3000, () => {
  console.log(
    "Magic at http://" + process.env.HOST_RUN + ":" + process.env.PORT_RUN
  );
});
