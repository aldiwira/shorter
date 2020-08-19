const {
  check,
  body,
  param,
  validationResult,
  oneOf,
} = require("express-validator");
const userModel = require("../models/userModel");
const linkModel = require("../models/linkModel");
const bcrypt = require("bcrypt");

const checkDatas = async (model, value, arg) => {
  return await model.findOne(value).then((res) => {
    if (res) {
      return Promise.reject(arg);
    }
  });
};

module.exports = {
  checkRegister: [
    check("username")
      .isLength({ min: 5 })
      .withMessage("wrong username length")
      .custom((value) => {
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
      .withMessage("wrong email format")
      .custom((value) => {
        return checkDatas(
          userModel,
          { email: value },
          "email was already taken"
        );
      }),
  ],
  checkLogin: [
    oneOf([
      check("username")
        .exists()
        .withMessage("username is required")
        .isLength({ min: 5 })
        .withMessage("wrong username length"),
      check("email")
        .exists()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Wrong email format"),
    ]),
    check("password")
      .isLength({ min: 7 })
      .withMessage("password must be at least 7 character"),
  ],
  checkCreateLink: [
    body("full_link").isURL().withMessage("Must be format url"),
    body("short_link")
      .isLength({ min: 5 })
      .withMessage("wrong short link length")
      .notEmpty()
      .withMessage("Must fill the short alias"),
  ],
  checkEditLink: [
    body("full_link").isURL().withMessage("Must be format url"),
    body("short_link")
      .isLength({ min: 5 })
      .withMessage("wrong short link length")
      .notEmpty()
      .withMessage("Must fill the short alias"),
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
  checkIdUser: [
    param("id").custom((value) => {
      return userModel.findById(value).then((val) => {
        if (val === null) {
          return Promise.reject("link id not found");
        }
      });
    }),
  ],
  checkChangePass: [
    check("old_password")
      .isLength({ min: 5 })
      .withMessage("password must be at least 7 character"),
    check("new_password")
      .isLength({ min: 5 })
      .withMessage("password must be at least 7 character")
      .custom((value, { req }) => {
        if (req.body.confirm_password !== value) {
          throw new Error("Password confirmation is incorrect");
        } else {
          return value;
        }
      }),
    check("confirm_password")
      .isLength({ min: 5 })
      .withMessage("password must be at least 7 character"),
  ],
  checkChangeProfile: [
    check("username")
      .isLength({ min: 5 })
      .withMessage("wrong username length")
      .custom((value) => {
        return userModel.findOne({ username: value }).then((data) => {
          if (data) {
            if (value !== data.username) {
              Promise.reject(`${value} as username was available`);
            }
          }
        });
      }),
    check("email")
      .isEmail()
      .withMessage("wrong email format")
      .custom((value) => {
        return userModel.findOne({ email: value }).then((data) => {
          if (data) {
            if (value !== data.email) {
              Promise.reject(`${value} as email was available`);
            }
          }
        });
      }),
  ],
};
