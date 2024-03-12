var express = require("express");
var router = express.Router();

/* GET reports */
router.get("/", global.authenticationMiddleware(), (req, res, next) => {
  res.render("reports", { title: "Reports" });
});

module.exports = router;
