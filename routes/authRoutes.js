const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController")

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
        passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    authController.authCallback,
);

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
    }),
    authController.authCallback,
);

module.exports = router;
