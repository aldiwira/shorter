const linkModel = require("../models/linkModel.js");
const response = require("../helper/response.js");
const checker = require("../helper/checker");
let data;
let code;
let massage;
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
    res.status(code).json(response.set(code, massage, data));
  },
  createLinkData: async (req, res) => {
    const datas = {
      full_link: req.body.full_link,
      short_link: req.body.short_link,
      owner: req.body.username,
      click_count: 0,
    };

    try {
      const checkowner = await checker.checkOwnerLink(datas, req.payload);
      const checklinkdata = await checker.checkingLinkData(datas);
      if (checkowner !== null) {
        if (checklinkdata === null) {
          await linkModel
            .create(datas)
            .then((result) => {
              code = response.CODE_CREATED;
              massage = response.RESPONSE_CREATED;
              data = result;
            })
            .catch((err) => {
              code = response.CODE_ERROR;
              massage = response.RESPONSE_ERROR;
              data = err;
            });
        } else {
          code = response.CODE_ERROR;
          massage = response.RESPONSE_ERROR;
          data = "Your link has shorter link";
        }
      } else {
        code = response.CODE_ERROR;
        massage = response.RESPONSE_ERROR;
        data = "Owner username not found";
      }
      res.status(code).json(response.set(code, massage, data));
    } catch (error) {
      res.json(error);
    }
  },
  deleteLinkData: async (req, res) => {
    let short_link = req.query.short_link;
    let full_link = req.query.full_link;
    try {
      linkModel
        .findOneAndDelete({
          $or: [{ short_link: short_link }, { full_link: full_link }],
        })
        .then((datas) => {
          code = response.CODE_SUCCESS;
          massage = "Link has deleted";
          data = [];
        })
        .catch((err) => {
          code = response.CODE_ERROR;
          massage = "your link is unknown";
          data = err;
        });
    } catch (error) {
      code = response.CODE_ERROR;
      massage = "your link is unknown";
      data = err;
    }
    res.status(code).json(response.set(code, massage, data));
  },
  updateLinkData: async (req, res) => {
    let filter = {
      _id: req.body.id,
    };
    let update = {
      full_link: req.body.full_link,
      short_link: req.body.short_link,
    };
    await linkModel
      .findByIdAndUpdate(filter, update, {
        userFindAndModify: false,
        new: true,
      })
      .then((result) => {
        code = response.CODE_SUCCESS;
        massage = "your link updated";
        data = result;
      })
      .catch((err) => {
        code = response.RESPONSE_ERROR;
        massage = "your link not updated";
        data = err;
      });
    res.status(code).json(response.set(code, massage, data));
  },
};
