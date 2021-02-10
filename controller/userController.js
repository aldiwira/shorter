const bcryp = require("bcrypt");
const { validationResult } = require("express-validator");
const moment = require("moment");

const userModel = require("../models/userModel");
const response = require("../helper/response");
const JWT = require("../helper/jwt");

let status;
let massage;
let data;

module.exports = {
  registerProcess: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let datas = {
      username: req.body.username,
      password: bcryp.hashSync(req.body.password, response.SALT_CODE),
      email: req.body.email,
    };
    try {
      await userModel.create(datas).then(async (result) => {
        status = response.CODE_CREATED;
        massage = "Success create users";
        data = {
          account: result._id,
          token: await JWT.JWTSign(result._id, result._isAdmin),
        };
        res.status(status).json(response.set(status, massage, data));
      });
    } catch (error) {
      next(error);
    }
  },
  loginProcess: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let datas = {
      email: req.body.email,
      password: req.body.password,
    };

    let condition = {
      filter: {
        email: datas.email,
      },
      update: {
        updatedAt: moment().utc().format(),
      },
    };

    // fetch user datas
    try {
      const userdatas = await userModel.findOneAndUpdate(
        condition.filter,
        condition.update,
        {
          useFindAndModify: false,
        }
      );

      if (userdatas !== null) {
        const passwordCheck = bcryp.compareSync(
          datas.password,
          userdatas.password
        );
        if (passwordCheck) {
          status = response.CODE_SUCCESS;
          massage = "Login was successful";
          data = {
            account: userdatas._id,
            token: await JWT.JWTSign(userdatas._id, userdatas._isAdmin),
          };
          res.status(status).json(response.set(status, massage, data));
        } else {
          throw new Error("Your Password is wrong");
        }
      } else {
        throw new Error("Check your username and password");
      }
    } catch (error) {
      next(error);
    }
  },
  logoutProcess: async (req, res) => {
    //fetch request body
    let ids = req.payload._id;
    let condition = {
      filter: {
        _id: ids,
      },
      update: {
        updatedAt: moment().utc().format(),
      },
    };

    //fetch user datas
    const userdatas = await userModel.findByIdAndUpdate(
      condition.filter,
      condition.update,
      {
        useFindAndModify: false,
      }
    );
    //validation and send response datas
    if (userdatas !== null) {
      status = response.CODE_SUCCESS;
      massage = "your account was logout";
      data = false;
    }
    res.status(status).json(response.set(status, massage, data));
  },
};
