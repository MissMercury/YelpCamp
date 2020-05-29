var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express(), 
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");
    seedDB = require("./seed");

//Requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(purl, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.urlencoded(
    { extended: true }
));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); // seed the database

//Config passport
app.use(require("express-session")({
    secret: "The university of Edinburgh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//Require routefiles
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//=============================================================================//
// LISTEN TO PORT
let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server has started successfully");
});
