const Mongoose = require("mongoose");

const link = Mongoose.Schema(
  {
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
    owner: {
      type: String,
      require: true,
    },
    lastVisit: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = Mongoose.model("link", link);
