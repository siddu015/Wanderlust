const User = require("../models/user");
const Listing = require('../models/listing');
const { v4: uuidv4 } = require("uuid");

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

        // Generate a random unique ID for users signing up normally
        const googleId = uuidv4();  // Generate a unique ID

        // Register new user (googleId is now unique for normal signup)
        const newUser = new User({
            firstname,
            lastname,
            email,
            phoneNo,
            username,
            googleId,  // Assign the generated unique ID here
        });

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

module.exports.renderEditForm =  async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect("/");
        }
        res.render("users/edit", { user });
    } catch (err) {
        req.flash("error", "Something went wrong!");
        res.redirect("/");
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, firstname, lastname, email, phoneNo } = req.body.user;

        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });
        const existingUserByPhoneNo = await User.findOne({ phoneNo });

        if (existingUserByEmail && existingUserByEmail._id.toString() !== id) {
            req.flash("error", "Email already in use. Please try another.");
            return res.redirect(`/${id}/edit`);
        }
        if (existingUserByUsername && existingUserByUsername._id.toString() !== id) {
            req.flash("error", "Username already taken. Please try another.");
            return res.redirect(`/${id}/edit`);
        }
        if (existingUserByPhoneNo && existingUserByPhoneNo._id.toString() !== id) {
            req.flash("error", "Phone number already in use. Please try another.");
            return res.redirect(`/${id}/edit`);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, firstname, lastname, email, phoneNo },
            { new: true, runValidators: true }
        );

        req.flash("success", "Profile updated successfully!");
        res.redirect(`/profile`);
    }
    catch (err) {
        req.flash("error", "Error updating profile!");
        res.redirect(`/${req.params.id}/edit`);
    }
}

module.exports.updateProfilePic = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        console.log(user);


        let url = req.file.path;
        let filename = req.file.filename;
        user.profilePic = {url, filename};
        await user.save();

        req.flash("success", "Profile Picture updated successfully!");
        res.redirect(`/profile`);
    } catch (err) {
        req.flash("error", "Error updating profile!");
        res.redirect(`/users/${req.params.id}/edit`);
    }
}
