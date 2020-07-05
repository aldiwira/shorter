const userModel = require("../models/userModel");
const checker = require("../helper/checker");
const bcryp = require("bcrypt");
const response = require("../helper/response");
const JWT = require("../helper/jwt");
const { validationResult } = require("express-validator");
let status;
let massage;
let data;

//for find and update userdatas
const findandupdate = async (condition) => {
  return await userModel.findOneAndUpdate(condition.filter, condition.update, {
    useFindAndModify: false,
    new: true,
  });
};

//generate json token
const generateJWT = async (id) => {
  return await JWT.JWTSign(id);
};

module.exports = {
  registerProcess: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let datas = {
      username: req.body.username,
      password: bcryp.hashSync(req.body.password, response.SALT_CODE),
      email: req.body.email,
    };
    await userModel
      .create(datas)
      .then(async (result) => {
        const jwt = await generateJWT(result._id);
        status = response.CODE_CREATED;
        massage = "Success create users";
        data = {
          account: result,
          token: jwt,
        };
      })
      .catch((err) => {
        status = response.CODE_ERROR;
        massage = "Failed create users";
        data = err;
      });
    res.status(status).json(response.set(status, massage, data));
  },
  loginProcess: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let datas = {
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    };

    let condition = {
      filter: {
        $or: [
          {
            email: datas.email,
          },
          {
            username: datas.username,
          },
        ],
      },
      update: {
        _isLogin: true,
      },
    };

    //check account status was login or no
    const isLogin = await checker.datas(userModel, condition.filter);
    //fetch user datas
    const userdatas = await findandupdate(condition.filter);

    if (userdatas) {
      //becrypt password datas
      const passwordCheck = bcryp.compareSync(
        datas.password,
        userdatas.password
      );
      if (passwordCheck) {
        //generate web token
        if (!isLogin._isLogin) {
          const jwt = await generateJWT(userdatas._id);
          status = response.CODE_SUCCESS;
          massage = "Login was successful";
          data = {
            account: userdatas,
            token: jwt,
          };
        } else {
          status = response.CODE_ERROR;
          massage = "Your account was active";
          data = false;
        }
      } else {
        status = response.CODE_ERROR;
        massage = "check your username or email and password";
        data = false;
      }
    } else {
      status = response.CODE_ERROR;
      massage = "check your username or email and password";
      data = false;
    }

    res.status(status).json(response.set(status, massage, data));
  },
  logoutProcess: async (req, res) => {
    //fetch request body
    let email = req.body.email;
    let condition = {
      filter: {
        email: {
          $regex: ".*" + email + ".*",
        },
      },
      update: {
        _isLogin: false,
      },
    };

    //fetch user datas
    const userdatas = await findandupdate(condition);
    //check account islogin
    const isLogin = await checker.datas(userModel, condition.filter);
    //validation and send response datas
    if (isLogin._isLogin) {
      status = response.CODE_ERROR;
      massage = "your account was login";
      data = false;
    } else {
      //checking datas for logout
      if (userdatas !== null) {
        status = response.CODE_SUCCESS;
        massage = "your account was logout";
        data = false;
      }
    }
    res.status(status).json(response.set(status, massage, data));
  },
};
