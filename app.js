const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path");
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError")
const {listingSchema, reviewSchema} = require("./schema.js")


const port = 8080
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

app.use((req, res, next) => {
    req.responseTime = new Date(Date.now()).toString(); // Attach response time to req object
    console.log(req.method, req.path, req.responseTime, req.hostname); // Log request details
    next(); // Passes control to the next middleware
});

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

main()
    .then(() => {
        console.log("Connected to DB.")
    })
    .catch((err) => {
        console.log(err)
    })

async function main(){
    await mongoose.connect(MONGO_URL);
}

//Home Route
app.get("/", (req, res) => {
    res.send("I'm groot")
})

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}));

//New Route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs")
}))

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { listing })
}))

//Create Route
app.post("/listings", validateListing, wrapAsync(async(req, res, next) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect("/listings")
}))

//Delete Route
app.delete("/listings/:id", wrapAsync( async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listings")
}))

//Reviews
//Post Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`)
}));


app.delete("/listings/:id/reviews/:reviewId", wrapAsync (async (req, res) => {
    let{ id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
    console.log(id)
}))


//unwanted route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})


//Error handling
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message)
})


//Patch Route
app.listen(port, () => {
    console.log(port," is running")
})


