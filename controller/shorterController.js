const linkModel = require("../models/linkModel.js");
const response = require("../helper/response.js");
let data, code, massage;
module.exports = {
  getLink: async (req, res) => {
    await linkModel
      .find()
      .then((datas) => {
        code = response.CODE_SUCCESS;
        massage = response.RESPONSE_SUCCESS;
        data = datas;
      })
      .catch((err) => {
        code = response.CODE_ERROR;
        massage = response.RESPONSE_ERROR;
        data = err;
      });
    res.json(response.set(code, massage, data));
  },
  createLinkData: async (req, res) => {
    const valid = linkModel.find({
      $or: [
        { full_link: req.body.full_link },
        { short_link: req.body.short_link },
      ],
    });
    if ((await valid).length == 0) {
      const link_data = new linkModel({
        full_link: req.body.full_link,
        short_link: req.body.short_link,
        click_count: 0,
      });
      await link_data
        .save()
        .then((datas) => {
          code = response.CODE_SUCCESS;
          massage = response.RESPONSE_SUCCESS;
          data = datas;
        })
        .catch((err) => {
          code = response.CODE_ERROR;
          massage = response.RESPONSE_ERROR;
          data = err;
        });
    } else {
      code = response.CODE_UNAUTHORIZED;
      massage = response.RESPONSE_ERROR;
      data = "Your link has shorter";
    }
    res.json(response.set(code, massage, data));
  },
};
