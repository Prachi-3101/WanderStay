const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRoute= require("./routes/listing.js")
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderStay";

main().then(()=>{
    console.log("connected to DataBase");
}).catch(err=>{
    console.log(err);
});
async function main() {
    await mongoose.connect (MONGO_URL) ; 
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 *60 *60 * 1000,
        maxAge: 7 * 24 *60 *60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "psoni2245"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.get("/",(req,res)=>{
    res.send("Helloo!!");
});

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);



//Reviews

app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found! Error 404"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,(req,res)=>{
    console.log("port is working");
});