// Import Necessary Files
var express    = require('express'),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    Blog = require("./models/Blog"),
    Comment = require("./models/Comment.js");

var app = express();


// Use EJS as viewing template 
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));

mongoose.connect("mongodb://localhost/Blogging"); //Database Connection Call

app.use(methodOverride('_method'));



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

// ==============
//    ROUTES
// ============== 

// index route
app.get("/",function(req,res){
    res.send("Welcome to the blogging website");
});

// Blogs route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
            console.log(err);
        else
            res.render("blogs.ejs" ,{blogs : blogs});
    });
});

// Display form to create blog
app.get("/new",function(req,res){
    res.render("Blogs/new"); 
});
 
// create new blog
app.post("/blogs",function(req,res){
    var title = req.body.title;
    var desc = req.body.description;
    var image = req.body.image;
    var blog = {
        title : title,
        description : desc,
        image : image
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
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("Blogs/show", {blog : blog});
    });    
});


// Edit form for Blog
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("Blogs/edit", { blog : blog });
    });
});

// Update Blogs
app.put("/blogs/:id",function(req,res){
    var title = req.body.title;
    var desc = req.body.description;
    var image = req.body.image;
    var blog = {
        title : title,
        description : desc,
        image : image
    };
    Blog.findByIdAndUpdate(req.params.id, blog, function(err,updatedblog){
        if(err)
            console.log(err);
        else
             res.redirect('/blogs/' + req.params.id);
    }); 
});

// Delete Blog
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err,blog){
        if(err)
            console.log(err);
        else
             res.redirect('/blogs');
    });
});


// ==================
// COMMENTS ROUTES
// ================== 

// Display new form to make a comment
app.get("/blogs/:id/comments/new",function(req,res){
    Blog.findById(req.params.id , function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("Comments/new", {blog: blog});
    });
});


// Create a new Comment Corresponding to a particular Blog
app.post("/blogs/:id/comments",function(req,res){
    var text = req.body.text;
    var author = req.body.author;
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
                        console.log(blog);
                         res.redirect('/blogs/'+ req.params.id);
                    }   
                });
            });
        }
    });
});

// Display a form to edit your comments
app.get("/blogs/:blogid/comments/:commentid/edit",function(req,res){
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
app.put("/blogs/:blogid/comments/:commentid",function(req,res){
    var text = req.body.text;
    var author = req.body.author;
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


// creating server
app.listen(3000, function(req,res){
    console.log("server started...");
});