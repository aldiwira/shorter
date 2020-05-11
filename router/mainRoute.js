const express = require("express");
const router = express.Router();
const user = require("../controller/userController");
const JWT = require("../helper/jwt");

router.post("/register", user.registerProcess);
router.post("/login", user.loginProcess);
router.post("/logout", user.logoutProcess);

module.exports = router;
