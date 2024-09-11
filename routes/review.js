const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError")
const { reviewSchema } = require("../schema.js")
const Review = require("../models/review.js")


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};


//Post Route
router.post("/",validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`)
}));


router.delete("/:reviewId", wrapAsync (async (req, res) => {
    let{ id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
    console.log(id)
}))

module.exports = router;