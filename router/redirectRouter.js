const express = require("express");
const router = express.Router();
const linkModel = require("../models/linkModel.js");

router.get("/:shortLink", (req, res) => {
  linkModel
    .findOne({ short_link: req.params.shortLink })
    .then((datas) => {
      const link = datas.full_link;
      if (link.includes("http://") || link.includes("https://")) {
        res.redirect(link);
      } else {
        try {
          res.redirect("https://" + link);
        } catch (error) {
          res.send(error);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
