const usermodel = require("../models/userModel");
const linkmodel = require("../models/linkModel");
const response = require("../helper/response");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
let codeStatus;
let massage;
let data;

module.exports = {
  fetchUserInformation: async (req, res) => {
    const id_user = req.payload._id;
    await usermodel
      .findById(id_user)
      .then((value) => {
        codeStatus = response.CODE_SUCCESS;
        massage = response.RESPONSE_SUCCESS;
        data = value;
      })
      .catch((err) => {
        codeStatus = response.CODE_ERROR;
        massage = response.RESPONSE_ERROR;
        data = err;
      });
    res.status(codeStatus).json(response.set(codeStatus, massage, data));
  },
  doChangePassword: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const id_user = req.payload._id;
    const datas = {
      old_pass: req.body.old_password,
      new_pass: bcrypt.hashSync(req.body.new_password, response.SALT_CODE),
      confirm_pass: bcrypt.hashSync(
        req.body.confirm_password,
        response.SALT_CODE
      ),
    };
    await usermodel.findById(id_user).then(async (value) => {
      const passwordCheck = await bcrypt.compareSync(
        datas.old_pass,
        value.password
      );
      if (passwordCheck) {
        await usermodel
          .findByIdAndUpdate(
            id_user,
            {
              password: datas.confirm_pass,
            },
            { useFindAndModify: false }
          )
          .then((value) => {
            codeStatus = response.CODE_SUCCESS;
            massage = "change password was successfull";
            data = true;
          })
          .catch((err) => {
            codeStatus = response.CODE_ERROR;
            massage = response.RESPONSE_ERROR;
            data = false;
          });
      } else {
        codeStatus = response.CODE_ERROR;
        massage = "wrong password";
        data = false;
      }
    });
    res.status(codeStatus).json(response.set(codeStatus, massage, data));
  },
  changeProfile: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const datas = {
      filter: {
        _id: req.payload._id,
      },
      update: {
        username: req.body.username,
        email: req.body.email,
      },
    };
    await usermodel
      .findByIdAndUpdate(datas.filter, datas.update, {
        useFindAndModify: false,
      })
      .then((value) => {
        codeStatus = response.CODE_SUCCESS;
        massage = "your account data was changed";
        data = value;
      })
      .catch((err) => {
        codeStatus = response.CODE_ERROR;
        massage = response.RESPONSE_ERROR;
        data = err;
      });
    res.status(codeStatus).json(response.set(codeStatus, massage, data));
  },
  removeAccount: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const datas = {
      filter: {
        _id: req.params.id,
      },
      update: {
        _id: req.payload._id,
      },
    };
    if (datas.filter._id === datas.update._id) {
      const deleteAcc = await usermodel
        .findByIdAndRemove(datas.filter, {
          useFindAndModify: false,
        })
        .then(async (value) => {
          if (value) {
            await linkmodel.find({ owner: datas.filter }).then((value) => {
              value.map(async (data) => {
                await linkmodel.findOneAndDelete(
                  { owner: datas.filter._id },
                  { useFindAndModify: false }
                );
              });
            });
            codeStatus = response.CODE_SUCCESS;
            massage = "your account data was deleted";
            data = true;
          }
        });
    } else {
      codeStatus = response.CODE_ERROR;
      massage = "Your account can't deleted";
      data = false;
    }
    res.status(codeStatus).json(response.set(codeStatus, massage, data));
  },
};
