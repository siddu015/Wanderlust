const User = require("../models/user");
const passport = require("passport");
const Listing = require('../models/listing');

// Show Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle Signup
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Show Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle Login
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

// Render Profile Page
module.exports.renderProfilePage = async (req, res, next) => {
    res.render('users/profile.ejs', { currUser: req.user });
};

// Render the user's listings
module.exports.renderUserListings = async (req, res, next) => {
    try {
        const listings = await Listing.find({ owner: req.user._id });
        console.log(listings)

        res.render('users/your-listings.ejs', { listings: listings });
    } catch (err) {
        next(err);
    }
};

