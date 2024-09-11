const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

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

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

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


