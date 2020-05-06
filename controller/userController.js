const userModel = require("../models/userModel");
const bcryp = require("bcrypt");
const response = require("../helper/response");
let status;
let massage;
let data;

const checkingDatas = async (email, username) => {
  return await userModel.findOne({
    $or: [{ email: email }, { username: username }],
  });
};

module.exports = {
  registerProcess: async (req, res) => {
    let username = req.body.username;
    let password = bcryp.hashSync(req.body.password, 10);
    let email = req.body.email;
    if ((await checkingDatas(email, username)) === null) {
      await userModel
        .create({
          username: username,
          password: password,
          email: email,
        })
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
    let email = req.body.email;
    let password = req.body.password;

    await userModel
      .findOne({
        email: {
          $regex: ".*" + email + ".*",
        },
      })
      .then((result) => {
        const le = bcryp.compareSync(password, result.password);
        if (le) {
          status = response.CODE_SUCCESS;
          massage = "Success Login";
          data = result;
        } else {
          status = response.CODE_UNAUTHORIZED;
          massage = "Failed Login";
          data = "username and password is wrong";
        }
      })
      .catch((err) => {
        status = response.CODE_ERROR;
        massage = "Failed Login";
        data = err;
      });
    res.status(status).json(response.set(status, massage, data));
  },
};
