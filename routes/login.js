var passport = require("passport");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("login", { title: "Login", message: null });
});

router.get("/login", (req, res) => {
  let errorMessage = null;
  let error = false;

  if (req.query.accessDenied) {
    errorMessage = "Access denied!";
    error = true;
  } else if (req.query.fail) {
    errorMessage = "Incorrect username and/or password!";
    error = true;
  } else if (req.query.reset)
    errorMessage = "Your new password will arrive in your email shortly!";

  res.render("login", {
    title: "Login",
    message: errorMessage,
    error,
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login?fail=true",
  })
);

router.post("/logoff", (req, res, next) => {
  req.logOut(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
