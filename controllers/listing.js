const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const {cloudinary} = require("../cloudConfig");


module.exports.index = async (req, res) => {
    const { q } = req.query;
    let allListings;

    if (q) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
            ],
        }).limit(10);
    } else {
        allListings = await Listing.find({});
    }

    if (req.xhr) {
        const suggestions = allListings.map(listing => ({
            title: listing.title,
            price: listing.price,
            url: `/listings/${listing._id}`,
        }));
        return res.json(suggestions);
    }

    res.render("listings/index.ejs", { allListings });
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

    const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = images;
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

// Render edit form for a listing with multiple images
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested to edit does not exist!");
        return res.redirect("/listings");
    }

    let imageUrls = [];
    if (listing.images && Array.isArray(listing.images)) {
        imageUrls = listing.images.map(image => {
            return image.url.replace("/upload", "/upload/h_100,w_250");
        });
    }

    res.render("listings/edit.ejs", { listing, imageUrls });
};

// Update a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    if (req.body.listing.location && req.body.listing.location !== listing.location) {
        const response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        listing.geometry = response.body.features[0].geometry;
        listing.location = req.body.listing.location;
    }

    Object.assign(listing, req.body.listing);

    // Only remove old images if new images are uploaded
    if (req.files && req.files.length > 0) {
        // Remove all old images from storage and database
        if (listing.images && listing.images.length > 0) {
            for (let img of listing.images) {
                await cloudinary.uploader.destroy(img.filename);
            }
            listing.images = [];
        }

        // Append new images if uploaded
        const newImages = req.files.map((file) => ({
            url: file.path,
            filename: file.filename,
        }));
        listing.images.push(...newImages);
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    // Find the listing by ID
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    if (listing.images && listing.images.length > 0) {
        for (let img of listing.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
