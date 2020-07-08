const express = require("express");
const router = express.Router();
const linkModel = require("../models/linkModel.js");
const counter = require("../helper/counter");

router.get("/:shortLink", (req, res) => {
  const short_link = { short_link: req.params.shortLink };
  linkModel
    .findOne(short_link)
    .then((datas) => {
      if (datas) {
        const link = datas.full_link;
        const value = datas.click_count;
        counter.count(value, req.params.shortLink).then((datas) => {});
        if (link.includes("http://") || link.includes("https://")) {
          res.redirect(link);
        } else {
          res.redirect("https://" + link);
        }
      } else {
        res.status(404).send("NOT FOUND");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
