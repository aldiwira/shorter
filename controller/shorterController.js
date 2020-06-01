const linkModel = require("../models/linkModel");
const userModel = require("../models/userModel");
const response = require("../helper/response");
const checker = require("../helper/checker");
let data;
let code;
let massage;
module.exports = {
  getLink: async (req, res) => {
    await linkModel.find().then((datas) => {
      code = response.CODE_SUCCESS;
      massage = response.RESPONSE_SUCCESS;
      data = datas;
    });
    res.status(code).json(response.set(code, massage, data));
  },
  //function for create link data
  createLinkData: async (req, res) => {
    const datas = {
      full_link: req.body.full_link,
      short_link: req.body.short_link,
      owner: req.payload._id,
      click_count: 0,
      lastVisit: response.getDate(),
    };
    const checkowner = await checker.checkOwnerLink(datas, req.payload);
    const checklinkdata = await checker.checkingLinkData(datas);
    if (checkowner !== null) {
      if (checklinkdata === null) {
        await linkModel.create(datas).then((result) => {
          code = response.CODE_CREATED;
          massage = response.RESPONSE_CREATED;
          data = result;
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
  },
  //function for delete link data by id
  deleteLinkData: async (req, res) => {
    let filter = {
      _id: req.params.id,
      owner: req.payload._id,
    };
    //checking link datas
    if (!(await checker.datas(linkModel, filter))) {
      code = response.CODE_REJECT;
      massage = "Your link not found";
      data = false;
    } else {
      //delete logic
      await linkModel.findByIdAndDelete(filter._id).then((result) => {
        code = response.CODE_SUCCESS;
        massage = "Your link deleted";
        data = true;
      });
    }
    res.status(code).json(response.set(code, massage, data));
  },
  //update link data
  updateLinkData: async (req, res) => {
    //fetch post datas
    let filter = {
      //id_link
      _id: req.params.id,
      //id_user
      owner: req.payload._id,
    };
    let update = {
      full_link: req.body.full_link,
      short_link: req.body.short_link,
      updatedAt: response.getDate(),
    };
    //check owner link
    const checkowner = await checker.datas(userModel, { _id: filter.owner });
    if (checkowner !== null) {
      await linkModel
        .findByIdAndUpdate(filter, update, {
          useFindAndModify: false,
          new: true,
        })
        .then((result) => {
          code = response.CODE_SUCCESS;
          massage = "your link updated";
          data = result;
        });
    } else {
      code = response.CODE_REJECT;
      massage = "Wrong Owner Link";
      data = false;
    }
    res.status(code).json(response.set(code, massage, data));
  },
  //fetch link by id
  fetchLinkById: async (req, res) => {
    const filter = {
      _id: req.payload._id,
    };
    const userdatas = await checker.datas(userModel, filter);
    if (!userdatas) {
      code = response.CODE_ERROR;
      massage = response.RESPONSE_ERROR;
      data = false;
    } else {
      await linkModel
        .find({
          owner: filter._id,
        })
        .then((result) => {
          code = response.CODE_SUCCESS;
          massage = response.RESPONSE_SUCCESS;
          data = result;
        });
    }
    res.status(code).json(response.set(code, massage, data));
  },
};
