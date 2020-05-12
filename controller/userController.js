const userModel = require("../models/userModel");
const checker = require("../helper/checker");
const bcryp = require("bcrypt");
const response = require("../helper/response");
const JWT = require("../helper/jwt");
let status;
let massage;
let data;

module.exports = {
  registerProcess: async (req, res) => {
    let datas = {
      username: req.body.username,
      password: bcryp.hashSync(req.body.password, 10),
      email: req.body.email,
    };
    if ((await checker.checkingUserData(datas)) === null) {
      await userModel
        .create(datas)
        .then((result) => {
          status = response.CODE_CREATED;
          massage = "Success create users";
          data = result;
        })
        .catch((err) => {
          status = response.CODE_ERROR;
          massage = "Failed create users";
          data = err;
        });
    } else {
      status = response.CODE_ERROR;
      massage = "Username or email is available";
      data = false;
    }
    res.status(status).json(response.set(status, massage, data));
  },
  loginProcess: async (req, res) => {
    //fetch request body
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    let filter = {
      email: email,
      username: username,
    };
    let update = {
      _isLogin: true,
    };
    //check account status was login or no
    const isLogin = await checker.checkiIsLogin(filter);
    //fetch user datas
    const userdatas = await userModel.findOneAndUpdate(filter, update, {
      useFindAndModify: false,
      new: true,
    });
    //validate datas
    if (isLogin !== null) {
      if (isLogin._isLogin) {
        status = response.CODE_ERROR;
        massage = "Your account was login";
        data = false;
      } else {
        if (userdatas !== null) {
          const le = bcryp.compareSync(password, userdatas.password);
          let jwttoken = await JWT.JWTSign(userdatas._id);
          if (le) {
            status = response.CODE_SUCCESS;
            massage = "Login was successful";
            data = {
              account: userdatas,
              token: jwttoken,
            };
          } else {
            status = response.CODE_ERROR;
            massage = "check your password and email";
            data = false;
          }
        }
      }
    } else {
      status = response.CODE_ERROR;
      massage = "check your password and email";
      data = false;
    }

    res.status(status).json(response.set(status, massage, data));
  },
  logoutProcess: async (req, res) => {
    //fetch request body
    let email = req.body.email;
    let filter = {
      email: {
        $regex: ".*" + email + ".*",
      },
    };
    let update = {
      _isLogin: false,
    };
    //fetch user datas
    const userdatas = await userModel.findOneAndUpdate(filter, update, {
      useFindAndModify: false,
      new: true,
    });
    //check account islogin
    const isLogin = await checker.checkiIsLogin(filter);
    //validation and send response datas
    if (isLogin._isLogin) {
      status = response.CODE_ERROR;
      massage = "your account was active";
      data = false;
    } else {
      if (userdatas !== null) {
        status = response.CODE_SUCCESS;
        massage = "your account was log out";
        data = false;
      }
    }
    res.status(status).json(response.set(status, massage, data));
  },
};
