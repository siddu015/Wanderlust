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
        const { username, firstname, lastname, phoneNo, email, password, confirmPassword } = req.body;

        // Check for existing user by email, username, or phone number
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });
        const existingUserByPhoneNo = await User.findOne({ phoneNo });

        if (existingUserByEmail) {
            req.flash("error", "Email already in use. Please try another.");
            return res.redirect("/signup");
        }
        if (existingUserByUsername) {
            req.flash("error", "Username already taken. Please try another.");
            return res.redirect("/signup");
        }
        if (existingUserByPhoneNo) {
            req.flash("error", "Phone number already in use. Please try another.");
            return res.redirect("/signup");
        }

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match!");
            return res.redirect("/signup");
        }

        // Register new user
        const newUser = new User({ firstname, lastname, email, phoneNo, username });
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
        res.render('users/your-listings.ejs', { listings });
    } catch (err) {
        next(err);
    }
};
