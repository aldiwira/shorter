const Mongoose = require("mongoose");
const dotenv = require("dotenv/config");

Mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connection Success");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = Mongoose;
