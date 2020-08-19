const Mongoose = require("mongoose");
const dotenv = require("dotenv").config();

Mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((err) => {
  console.log(err);
});
Mongoose.Promise = global.Promise;

module.exports = Mongoose;
