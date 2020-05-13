const linkModel = require("../models/linkModel.js");
module.exports = {
  count: async (value, id) => {
    value++;
    let date = Date.now();
    const filter = { short_link: id };
    const update = { click_count: value, lastVisit: date };
    let counter = await linkModel.findOneAndUpdate(filter, update, {
      useFindAndModify: false,
      new: true,
    });
    return counter;
  },
};
