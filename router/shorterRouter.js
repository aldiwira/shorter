const express = require("express");
const router = express.Router();
const controller = require("../controller/shorterController.js");
const JWT = require("../helper/jwt");

router.get("/", JWT.JWTAuth, controller.getLink);
router.post("/create", JWT.JWTAuth, controller.createLinkData);
router.put("/update", JWT.JWTAuth, controller.updateLinkData);
router.delete("/", JWT.JWTAuth, controller.deleteLinkData);

module.exports = router;
