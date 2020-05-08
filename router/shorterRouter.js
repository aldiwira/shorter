const express = require("express");
const router = express.Router();
const controller = require("../controller/shorterController.js");

router.get("/", controller.getLink);
router.post("/create", controller.createLinkData);
router.put("/update", controller.updateLinkData);
router.delete("/", controller.deleteLinkData);

module.exports = router;
