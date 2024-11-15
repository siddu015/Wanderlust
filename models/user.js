const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const url = require("node:url");

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    profilePic: {
        url: {
            type: String,
            default: "https://img.freepik.com/premium-photo/young-smiling-man-cartoon-showing-ok-sign_894067-15510.jpg",
        },
        filename: {
            type: String, // Correct type
            default: "",
        },
    },
});

// Add Passport-Local Mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
