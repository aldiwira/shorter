const linkModel = require("../models/linkModel");
const userModel = require("../models/userModel");
const response = require("../helper/response");
const checker = require("../helper/checker");
const { validationResult } = require("express-validator");
let data;
let code;
let massage;

const checkDatas = async (type, condition) => {
  if (type === "owner") return await checker.datas(userModel, condition);
  if (type === "link") return await checker.datas(linkModel, condition);
};

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const datas = {
      full_link: req.body.full_link,
      short_link: req.body.short_link,
      owner: req.payload._id,
      click_count: 0,
      lastVisit: Date.now(),
    };
    const checklinkdata = await checkDatas("link", {
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
    if (!checklinkdata) {
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
    res.status(code).json(response.set(code, massage, data));
  },
  fetchByIdLink: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    await linkModel
      .findById(req.params.id)
      .then((result) => {
        code = response.CODE_SUCCESS;
        massage = response.RESPONSE_SUCCESS;
        data = result;
      })
      .catch((err) => {
        code = response.CODE_ERROR;
        massage = response.RESPONSE_ERROR;
        data = err;
      });
    res.status(code).json(response.set(code, massage, data));
  },
  //function for delete link data by id
  deleteLinkData: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let filter = {
      _id: req.params.id,
      owner: req.payload._id,
    };
    //delete logic
    await linkModel.findByIdAndDelete(filter._id).then((result) => {
      code = response.CODE_SUCCESS;
      massage = "Your link deleted";
      data = true;
    });

    res.status(code).json(response.set(code, massage, data));
  },
  //update link data
  updateLinkData: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
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
    };
    //check owner link
    const checkOwner = await checkDatas("owner", { _id: filter.owner });

    if (checkOwner) {
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
