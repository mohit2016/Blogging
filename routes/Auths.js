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
            req.flash("error",err.message);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to Website "+ user.username);
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
    req.flash("success","Logged you out");
    res.redirect("/blogs");
});


module.exports = router;