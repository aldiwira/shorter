const Mongoose = require("mongoose");
const dotenv = require("dotenv/config");

Mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
Mongoose.Promise = global.Promise;

module.exports = Mongoose;
