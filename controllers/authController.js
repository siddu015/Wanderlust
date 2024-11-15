const passport = require("passport");

exports.authCallback = (req, res, next) => {
    req.flash("success", "Welcome to Wanderlust, Update Your details");
    res.redirect("/profile");
};
