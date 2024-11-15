const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/user");
const { saveRedirectUrl, isLoggedIn } = require("../middleware");

// Signup Routes
router.route("/signup")
    .get(wrapAsync(userController.renderSignupForm))
    .post(wrapAsync(userController.signup));

// Login Routes
router.route("/login")
    .get(wrapAsync(userController.renderLoginForm))
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        wrapAsync(userController.login)
    );

// Logout Route
router.get("/logout",
    isLoggedIn,
    (userController.logout));

// Profile Page Route
router.get("/profile",
    isLoggedIn,
    wrapAsync(userController.renderProfilePage));

// User Listings Route
router.route("/your-listings")
    .get(isLoggedIn, wrapAsync(userController.renderUserListings));

// Edit Profile Route
router.get("/:id/edit", isLoggedIn, wrapAsync(userController.renderEditForm));

// Update Profile Route
router.put("/:id", isLoggedIn, wrapAsync(userController.updateProfile));

module.exports = router;
