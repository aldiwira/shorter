const userModel = require("../models/userModel");
const linkModel = require("../models/linkModel");

module.exports = {
  checkingUserData: async (datas) => {
    return await userModel.findOne({
      $or: [
        {
          email: datas.email,
        },
        {
          username: datas.username,
        },
      ],
    });
  },
  checkingLinkData: async (datas) => {
    return await linkModel.findOne({
      $or: [
        {
          full_link: datas.full_link,
        },
        {
          short_link: datas.short_link,
        },
      ],
      owner: datas.owner,
    });
  },
  checkiIsLogin: async (datas) => {
    return await userModel.findOne(datas);
  },
  checkOwnerLink: async (datas, payload) => {
    return await userModel.findOne({
      _id: payload._id,
      username: datas.owner,
    });
  },
};
