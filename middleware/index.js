var middlewareObject = {};

middlewareObject.permissionChecker = function (req, res, next) {
  if(req.isAuthenticated() && req.user.permission === "admin"){
    next();
  } else {
    req.flash("error", "no permission");
    res.redirect("back");
  }
};


middlewareObject.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }else{
    req.flash('error', 'you have to be logged in')
    res.redirect("/admin/login")
  }
};


module.exports = middlewareObject;