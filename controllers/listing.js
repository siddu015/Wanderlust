const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//All listings
module.exports.index = async (req, res) => {
    const { category, location } = req.query;
    let query = {};

    if (category) query.category = category;
    if (location) query.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive location search

    const allListings = await Listing.find(query);

    if (!category && !location) {
        res.render("listings/index.ejs", { allListings });
    } else {
        res.render("listings/filter.ejs", { allListings });
    }
};


//Form to create a new Listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//Rendering individual listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Create a new listing
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    // Process uploaded images
    const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));

    // Create a new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = images; // Save all uploaded images
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();


    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}


// Render edit form for a listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested to edit does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (req.body.listing.location && req.body.listing.location !== listing.location) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        listing.geometry = response.body.features[0].geometry;
        listing.location = req.body.listing.location;
        await listing.save();
    }

    listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
