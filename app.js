if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const port = 8080
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
//let dbUrl = process.env.ATLASDB_URL

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


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
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


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    req.responseTime = new Date(Date.now()).toString();
    console.log(req.method, req.path, req.responseTime, req.hostname);
    next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//Home Route
app.get("/", (req, res) => {
    res.redirect("/listings")
})


app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)

//unwanted route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

//Error handling
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err
    res.status(statusCode).render("error.ejs", { message })
})

//Patch Route
app.listen(port, () => {
    console.log(port," is running")
})


