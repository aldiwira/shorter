const userModel = require("../models/userModel");
const checker = require("../helper/checker");
const bcryp = require("bcrypt");
const response = require("../helper/response");
const JWT = require("../helper/jwt");
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

module.exports = {
  registerProcess: async (req, res) => {
    let datas = {
      username: req.body.username,
      password: bcryp.hashSync(req.body.password, response.SALT_CODE),
      email: req.body.email,
    };
    let condition = {
      $or: [
        {
          email: datas.email,
        },
        {
          username: datas.username,
        },
      ],
    };

    if (!(await checker.datas(userModel, condition))) {
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
    let datas = {
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    };

    let condition = {
      filter: {
        email: datas.email,
        username: datas.username,
      },
      update: {
        _isLogin: true,
      },
    };

    //check account status was login or no
    const isLogin = await checker.datas(userModel, condition.filter);
    //fetch user datas
    const userdatas = await findandupdate(condition);

    //cheking status login account
    if (isLogin._isLogin) {
      status = response.CODE_ERROR;
      massage = "Your account was login";
      data = false;
    } else {
      //checking userdatas
      if (userdatas !== null) {
        //becrypt password datas
        const le = bcryp.compareSync(datas.password, userdatas.password);
        //generate JWT Code
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
      } else {
        status = response.CODE_ERROR;
        massage = "check your password and email";
        data = false;
      }
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
