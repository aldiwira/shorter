const express = require("express");
const app = express();
const bodyparse = require("body-parser");
const mongoose = require("./config/db.js");
const dotenv = require("dotenv/config");
const shorterRoute = require("./router/shorterRouter.js");
const redirectRoute = require("./router/redirectRouter.js");

app.use(bodyparse.json());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Shorter Link");
});
//for handle shorter process
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
