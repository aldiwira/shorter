const linkModel = require("../models/linkModel.js");
module.exports = {
  count: async (value, id) => {
    value++;
    const filter = { short_link: id };
    const update = { click_count: value };
    let counter = await linkModel.findOneAndUpdate(filter, update);
    return counter;
  },
};
