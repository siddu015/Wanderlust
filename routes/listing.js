const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing");
const multer  = require('multer')
const {storage} = require("../cloudConfig");
const upload = multer({ storage })


// Index and Create Routes
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.array("listing[images]", 5),
        (req, res, next) => {
            // Add images from uploaded files to req.body
            req.body.listing.images = req.files.map((file) => ({
                url: file.path,
                filename: file.filename,
            }));
            next();
        },
        validateListing,
        wrapAsync(listingController.createListing)
    );


// New Route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);


// Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));


// Show, Update, and Delete Routes
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.array("listing[images]"),  // Handles multiple image uploads
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;

