const express = require("express");
const app = express();
const dotenv = require("dotenv/config");

app.get("/", (req, res) => {
  res.send("Shorter Link");
});

app.listen(process.env.PORT_RUN || 3000, () => {
  console.log(
    "Magic at http://" + process.env.HOST_RUN + ":" + process.env.PORT_RUN
  );
});
