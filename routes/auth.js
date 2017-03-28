var express = require('express');
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var User = require('../models/user');


router.get('/admin/login', function (req, res) {
  res.render('admin/auth/login');
});

router.get('/admin/register', middleware.permissionChecker, function (req, res) {
  res.render('admin/auth/register')
});

router.post('/admin/register', middleware.isLoggedIn, function (req, res) {
  if(req.body.password === req.body.pass2) {
    var userInfo = req.body.user;
    userInfo.pic = 'user-icon.png';
    User.register(userInfo, req.body.password, function (err, user) {
      if(err){
        res.send(err)
      }else{
        res.redirect('/admin/login')
      }
    })
  }else{
    res.send('Password Typo')
  }
});

router.post("/admin/login", passport.authenticate("local", {
  successRedirect: "/admin/admin-panel",
  failureRedirect: "/admin/login"
}), function (req, res) {
  req.flash("success", 'Welcome');
  res.redirect("back");
});

router.get("/admin/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/");
});




module.exports = router;