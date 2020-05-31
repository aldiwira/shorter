const express = require("express");
const router = express.Router();
const controller = require("../controller/shorterController.js");
const JWT = require("../helper/jwt");

//get all link datas
router.get("/", JWT.JWTAuth, controller.getLink);
//get all link datas by id user
router.get("/:id", JWT.JWTAuth, controller.fetchLinkById);
//create shorter
router.post("/create", JWT.JWTAuth, controller.createLinkData);
//edit shorter
router.put("/update", JWT.JWTAuth, controller.updateLinkData);
//delete shorter
router.delete("/", JWT.JWTAuth, controller.deleteLinkData);

module.exports = router;
