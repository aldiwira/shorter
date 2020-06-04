const userModel = require("../models/userModel");
const linkModel = require("../models/linkModel");

module.exports = {
  datas: async (model, condition) => {
    return await model.findOne(condition);
  },
};
