const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

// Signup Routes
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login Routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

// Logout Route
router.get("/logout", userController.logout);

// Profile Page Routes
router.route("/profile")
    .get(wrapAsync(userController.renderProfilePage));

// Route to show the user's listings
router.route('/your-listings')
    .get(userController.renderUserListings);

module.exports = router;
