const express = require("express");
const router = express.Router();
const user = require("../controller/userController");
const uHandling = require("../controller/userHandling");
const validator = require("../helper/myValidator");
const JWT = require("../helper/jwt");

//Register account
router.post("/register", validator.checkRegister, user.registerProcess);
//LogIn Account
router.post("/login", validator.checkLogin, user.loginProcess);
//LogOut Account
router.post("/logout", JWT.JWTAuth, user.logoutProcess);

//router user handling
router.get("/user", JWT.JWTAuth, uHandling.fetchUserInformation);
//change password
router.post(
  "/user/changepassword",
  JWT.JWTAuth,
  validator.checkChangePass,
  uHandling.doChangePassword
);
//change username and email
router.put(
  "/user/edit",
  JWT.JWTAuth,
  validator.checkChangeProfile,
  uHandling.changeProfile
);

module.exports = router;
