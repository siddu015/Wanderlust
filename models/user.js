const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
    },
    profilePic: {
        url: {
            type: String,
            default: "https://img.freepik.com/premium-photo/young-smiling-man-cartoon-showing-ok-sign_894067-15510.jpg",
        },
        filename: {
            type: String,
            default: "",
        },
    },
    googleId: {
        type: String,
        unique: true,
    },
    googleProfilePic: {
        type: String,
    },
});

userSchema.plugin(passportLocalMongoose);

// Function to find or create user via Google OAuth
userSchema.statics.findOrCreateGoogleUser = async function(profile, done) {
    try {
        const existingUser = await this.findOne({ googleId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = await this.create({
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
            googleProfilePic: profile.photos[0].value,
        });

        return done(null, newUser);
    } catch (error) {
        done(error, null);
    }
};

module.exports = mongoose.model("User", userSchema);
