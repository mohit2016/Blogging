// Import Necessary Files
var express    = require('express'),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    Blog = require("./models/Blog"),
    Comment = require("./models/Comment"),
    User = require("./models/User"),
    passport = require("passport"),
    passportLocal = require("passport-local"),
    comments = require("./routes/Comments"),
    blogs = require("./routes/Blogs"),
    auths = require("./routes/Auths");



var app = express();

mongoose.connect("mongodb://localhost/Blogging"); //Database Connection Call

// Use EJS as viewing template 
app.set('view engine','ejs');

// app.use(bodyParser.urlencoded({extended:true}));
app.use(require('body-parser').urlencoded({ extended: true }));



// to use method Override
app.use(methodOverride('_method'));
// can use public directory now
app.use(express.static("public")); 

// body parser
app.use(bodyParser.urlencoded({extended:true}));
// enable express-session
app.use(require("express-session")({
    secret : "This string is used to encode and decode the password",
    resave: false,
    saveUninitialized:false
}));
// authentication in use
app.use(passport.initialize());
app.use(passport.session());

// currentUser var is available to complete app
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next(); 
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Blog.create({
//     title : "First Blog",
//     description : "I love my Blog website",
//     image : "https://pixabay.com/get/ea36b30e2cf5013ed1584d05fb1d4e97e07ee3d21cac104497f6c17faeecb1bd_340.jpg",
//     comments : []
// },function(err,blog){
//     if(err)
//         console.log(err);
//     else{
//         Comment.create({
//             text : "first comment",
//             author : "mohit"   
//         },function(err,comment){
//             if(err)
//                 console.log(err);
//             else{
//                 blog.comments.push(comment);
//                 blog.save(function(err,blog){
//                     if(err)
//                         console.log(err);
//                     else
//                         console.log(blog);
//                 });
//             }         
//         });
//     }       
// });



// These are routes
app.use("/",blogs);
app.use("/",comments);
app.use("/",auths);


// creating server
app.listen(3000, function(req,res){
    console.log("server started...");
});