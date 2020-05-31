const express = require("express");
const router = express.Router();
const user = require("../controller/userController");
const JWT = require("../helper/jwt");

//Register account
router.post("/register", user.registerProcess);
//LogIn Account
router.post("/login", user.loginProcess);
//LogOut Account
router.post("/logout", user.logoutProcess);

module.exports = router;
