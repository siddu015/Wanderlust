const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("./models/user");

// Local Strategy Configuration
passport.use(
    new LocalStrategy(
        { usernameField: "loginField", passwordField: "password" },
        async (loginField, password, done) => {
            try {
                const query = {
                    $or: [
                        { email: loginField }, // Match by email
                        { username: loginField }, // Match by username
                    ],
                };

                // Add phone number check only if `loginField` is numeric
                if (!isNaN(loginField)) {
                    query.$or.push({ phoneNo: Number(loginField) });
                }

                const user = await User.findOne(query);

                if (!user) {
                    return done(null, false, { message: "Invalid login credentials." });
                }

                const isMatch = await user.authenticate(password);

                if (!isMatch) {
                    return done(null, false, { message: "Invalid login credentials." });
                }

                return done(null, user);
            } catch (err) {
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


// passport.use(
//     new FacebookStrategy({
//             clientID: process.env.FACEBOOK_APP_ID,
//             clientSecret: process.env.FACEBOOK_APP_SECRET,
//             callbackURL: 'http://localhost:8080/auth/facebook/callback',
//             profileFields: ['id', 'emails', 'name', 'picture']
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 // Use the `findOrCreateFacebookUser` method to either find or create a new user
//                 const user = await User.findOrCreateFacebookUser(profile, done);
//                 return done(null, user);
//             } catch (error) {
//                 return done(error, null);
//             }
//         })
// );



// Serialize and Deserialize User
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
