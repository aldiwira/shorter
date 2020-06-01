const express = require("express");
const router = express.Router();
const controller = require("../controller/shorterController.js");
const JWT = require("../helper/jwt");

//get all link datas
router.get("/a", JWT.JWTAuth, controller.getLink);
//create shorter
router.post("/create", JWT.JWTAuth, controller.createLinkData);
//get all link datas by id user
router.get("/", JWT.JWTAuth, controller.fetchLinkById);
//delete shorter
router.delete("/:id/delete", JWT.JWTAuth, controller.deleteLinkData);
//edit shorter
router.put("/:id/update", JWT.JWTAuth, controller.updateLinkData);

module.exports = router;
