const express = require("express");
const router = express.Router();
const controller = require("../controller/shorterController.js");
const validator = require("../helper/myValidator");
const JWT = require("../helper/jwt");

//get all link datas
router.get("/a", JWT.JWTAuth, controller.getLink);
//create shorter
router.post(
  "/create",
  JWT.JWTAuth,
  validator.checkCreateLink,
  controller.createLinkData
);
//get all link datas by id user
router.get("/", JWT.JWTAuth, controller.fetchLinkById);
router.get("/:id", JWT.JWTAuth, validator.checkid, controller.fetchByIdLink);
//delete shorter
router.delete(
  "/:id/delete",
  JWT.JWTAuth,
  validator.checkid,
  controller.deleteLinkData
);
//edit shorter
router.put(
  "/:id/update",
  JWT.JWTAuth,
  validator.checkCreateData,
  controller.updateLinkData
);

module.exports = router;
