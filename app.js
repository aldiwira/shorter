const express = require("express");
const app = express();
const mongoose = require("./config/db.js");
const Mongoose = require("mongoose");
const dotenv = require("dotenv/config");

// Mongoose.connect(process.env.DB_HOST, {
//   useNewUrlParser: true,
// })
//   .then(() => {
//     console.log("connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.get("/", (req, res) => {
  res.send("Shorter Link");
});

app.listen(process.env.PORT_RUN || 3000, () => {
  console.log(
    "Magic at http://" + process.env.HOST_RUN + ":" + process.env.PORT_RUN
  );
});
