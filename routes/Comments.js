var Blog = require("../models/Blog"),
    Comment = require("../models/Comment"),
    express= require("express");
     const router = express.Router(); 

// ==================
// COMMENTS ROUTES
// ================== 

// Display new form to make a comment
router.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id , function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("Comments/new", {blog: blog});
    });
});


// Create a new Comment Corresponding to a particular Blog
router.post("/blogs/:id/comments",isLoggedIn,function(req,res){
    var text = req.body.text;
    var author = {
        id  : req.user._id,
        username : req.user.username
    };
    var comment = {
        text : text,
        author : author
    };
    Blog.findById(req.params.id , function(err,blog){
        if(err)
            console.log(err);
        else{
            Comment.create(comment, function(err,comment){
                blog.comments.push(comment);
                blog.save(function(err,blog){
                    if(err)
                        console.log(err);
                    else{
                        
                         res.redirect('/blogs/'+ req.params.id);
                    }   
                });
            });
        }
    });
});

// Display a form to edit your comments
router.get("/blogs/:blogid/comments/:commentid/edit",checkCommentOwnership,function(req,res){
    Blog.findById(req.params.blogid,function(err,blog){
        if(err)
            console.log(err);
        else{
            Comment.findById(req.params.commentid,function(err,comment){
                if(err)
                    console.log(err);
                else{
                    res.render("comments/edit", {comment :comment , blog :blog});                
                }
                
            });
        }
    }); 
});

// Update your comments
router.put("/blogs/:blogid/comments/:commentid",checkCommentOwnership,function(req,res){
    var text = req.body.text;
    var author = {
        id  : req.user._id,
        username : req.user.username
    };
    var comment = {
        text : text,
        author : author
    };
    Comment.findByIdAndUpdate(req.params.commentid, comment, function(err,comment){
        if(err)
            console.log(err);
        else
             res.redirect('/blogs/'+ req.params.blogid);
    });
});

// Delete Comments
router.delete("/blogs/:blogid/comments/:commentid",checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.commentid,function(err,comment){
        if(err)
            console.log(err);
        else
             res.redirect('/blogs/' + req.params.blogid);
    });
});


// This is middleware to check wether user is login or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        req.flash("error","You need to login to do that");
        return res.redirect("/login");
}

// Check if the user really own this comment
function checkCommentOwnership(req,res,next){
    // check if someone is loged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentid, function(err,comment){
            if(err)
                console.log(err);
            else{              
                // check if the author made this comment
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permissions to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to login to do that");
        res.send('You need to login first');
    }
}


module.exports = router;
