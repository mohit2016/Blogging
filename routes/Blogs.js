var Blog = require("../models/Blog"),
    express= require("express");
const router = express.Router();

// ==============
//  BLOGS  ROUTES
// ============== 

// index route
router.get("/",function(req,res){
    res.send("Welcome to the blogging website");
});

// Blogs route
router.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
            console.log(err);
        else
            res.render("blogs" ,{blogs : blogs});
    });
});

// Display form to create blog
router.get("/new", isLoggedIn ,function(req,res){
    res.render("Blogs/new"); 
});
 
// create new blog
router.post("/blogs", isLoggedIn ,function(req,res){
    
    var title = req.body.title;
    var desc = req.body.description;
    var image = req.body.image;
    var author = {
        id  : req.user._id,
        username : req.user.username
    };
    var blog = {
        title : title,
        description : desc,
        image : image,
        author : author
    };
    Blog.create(blog,function(err,blog){
        if(err)
            console.log(err);
        else{
            console.log("Blog created..!");
             res.redirect('blogs');
        }
            
    });
});

// Show a particular Blog
router.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("Blogs/show", {blog : blog});
    });    
});


// Edit form for Blog
router.get("/blogs/:id/edit" , checkBlogOwnership ,function(req,res){
 
        Blog.findById(req.params.id, function(err,blog){
                   res.render("Blogs/edit", { blog : blog });
        
        });
});


// Update Blogs
router.put("/blogs/:id",checkBlogOwnership,function(req,res){
    var title = req.body.title;
    var desc = req.body.description;
    var image = req.body.image;
    var author = {
        id  : req.user._id,
        username : req.user.username
    };
    var blog = {
        title : title,
        description : desc,
        image : image,
        author : author, 
    };
    Blog.findByIdAndUpdate(req.params.id, blog, function(err,updatedblog){
        if(err)
            console.log(err);
        else
             res.redirect('/blogs/' + req.params.id);
    }); 
});

// Delete Blog
router.delete("/blogs/:id",checkBlogOwnership,function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err,blog){
        if(err)
            console.log(err);
        else
             res.redirect('/blogs');
    });
});



// This is middleware to check wether user is login or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        return res.redirect("/login");
}

// Check if user really own this Blog
function checkBlogOwnership(req,res,next){
    // check if someone is loged in
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err,blog){
            if(err)
                console.log(err);
            else{              
                // check if the author owns the Blog
                if(blog.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.send("You don't have permission to do that");
                }
            }
        });
    }else{
        res.send('You need to login first');
    }
}

module.exports = router;