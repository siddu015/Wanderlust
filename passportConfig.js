const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");

// Local Strategy Configuration
passport.use(
    new LocalStrategy(
        { usernameField: "loginField", passwordField: "password" },
        async (loginField, password, done) => {
            try {
                if (!loginField || !password) {
                    return done(null, false, { message: "Invalid login credentials." });
                }

                const query = {
                    $or: [
                        { email: loginField },
                        { username: loginField },
                    ],
                };

                // Only check phoneNo if loginField is numeric
                if (!isNaN(loginField)) {
                    query.$or.push({ phoneNo: loginField });
                }

                const user = await User.findOne(query);

                if (!user) {
                    return done(null, false, { message: "Invalid login credentials." });
                }

                // Authenticate using passport-local-mongoose's method
                const { user: authenticatedUser, error } = await User.authenticate()(user.username, password);
                if (error || !authenticatedUser) {
                    return done(null, false, { message: "Incorrect password." });
                }

                return done(null, authenticatedUser);
            } catch (err) {
                console.error("Error during authentication:", err);
                return done(err);
            }
        }
    )
);

// Google OAuth Strategy Configuration
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://wandelast.onrender.com/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                });
                await user.save();
            }
            return done(null, user);
        }
    )
);


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
