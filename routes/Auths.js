var User = require("../models/User"),
    express= require("express"),
    passport = require("passport");
const router = express.Router();

// ==============
//  AUTH  ROUTES
// ============== 

// Display a Register form to signup
router.get("/register",function(req,res){
    res.render("Auth/register");    
});

// Register a User to Database
router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/blogs");
        });
    });
});


// Display a form to login

router.get("/login",function(req,res){
    res.render("Auth/login");
});


// Check for Login
router.post("/login",passport.authenticate("local",{
    successRedirect : "/blogs",
    failureRediriect : "/login"
}), function(req,res){
});

// Logout
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});


// This is middleware to check wether user is login or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        return res.redirect("/login");
}

module.exports = router;