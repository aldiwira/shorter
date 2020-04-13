const Mongoose = require("mongoose");

const link = Mongoose.Schema({
  full_link: {
    type: String,
    required: true,
  },
  short_link: {
    type: String,
    require: true,
  },
  click_count: {
    type: Number,
    require: true,
  },
  lastVisit: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("link", link);
