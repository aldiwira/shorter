const { check, body, param, validationResult } = require("express-validator");
const userdata = require("../models/userModel");
const userModel = require("../models/userModel");
const linkModel = require("../models/linkModel");

const checkDatas = async (model, value, arg) => {
  return await model.findOne(value).then((res) => {
    if (res) {
      return Promise.reject(arg);
    }
  });
};

module.exports = {
  checkRegister: [
    check("username").custom((value) => {
      return checkDatas(
        userModel,
        { username: value },
        "Username was already taken"
      );
    }),
    check("password")
      .isLength({ min: 7 })
      .withMessage("password must be at least 7 character"),
    check("email")
      .isEmail()
      .custom((value) => {
        return checkDatas(
          userModel,
          { email: value },
          "email was already taken"
        );
      }),
  ],
  checkLogin: [
    check("email").isEmail(),
    check("password")
      .isLength({ min: 7 })
      .withMessage("password must be at least 7 character"),
  ],
  checkCreateLink: [
    body("full_link").isURL().withMessage("Must be format url"),
    body("short_link").notEmpty().withMessage("Must fill the short alias"),
  ],
  checkCreateData: [
    body("full_link").isURL().withMessage("Must be format url"),
    body("short_link").notEmpty().withMessage("Must fill the short alias"),
    param("id").custom((value) => {
      return linkModel.findById(value).then((val) => {
        if (val === null) {
          return Promise.reject("link id not found");
        }
      });
    }),
  ],
  checkid: [
    param("id").custom((value) => {
      return linkModel.findById(value).then((val) => {
        if (val === null) {
          return Promise.reject("link id not found");
        }
      });
    }),
  ],
};
