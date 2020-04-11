const express = require("express");
const router = express.Router();
const controller = require("../controller/shorterController.js");

router.get("/", controller.getLink);
router.post("/", controller.createLinkData);

module.exports = router;
