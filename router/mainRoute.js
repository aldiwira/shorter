const express = require("express");
const router = express.Router();
const user = require("../controller/userController");
const validator = require("../helper/myValidator");
const JWT = require("../helper/jwt");

//Register account
router.post("/register", validator.checkRegister, user.registerProcess);
//LogIn Account
router.post("/login", validator.checkLogin, user.loginProcess);
//LogOut Account
router.post("/logout", JWT.JWTAuth, user.logoutProcess);

module.exports = router;
