const { check } = require("express-validator");
const userdata = require("../models/userModel");

const checkDatas = async (value, arg) => {
  return await userdata.findOne(value).then((res) => {
    if (res) {
      return Promise.reject(arg);
    }
  });
};

module.exports = {
  checkRegister: [
    check("username").custom((value) => {
      return checkDatas({ username: value }, "Username was already taken");
    }),
    check("password")
      .isLength({ min: 7 })
      .withMessage("password must be at least 7 character"),
    check("email")
      .isEmail()
      .custom((value) => {
        return checkDatas({ email: value }, "email was already taken");
      }),
  ],
  checkLogin: [
    check("email").isEmail(),
    check("password")
      .isLength({ min: 7 })
      .withMessage("password must be at least 7 character"),
  ],
};
