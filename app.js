// Import Necessary Files
var express    = require('express'),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");

var app = express();

// Use EJS as viewing template 
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));

mongoose.connect("mongodb://localhost/Blogging"); //Database Connection Call

app.use(methodOverride('_method'));

// Blog Schema
var BlogSchema = new mongoose.Schema({
    title : String,
    description : String,
    image : String
});

// Creating Model corresponding to the Schema
var Blog =  mongoose.model("Blog", BlogSchema);


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
    res.render("new"); 
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
    Blog.findById(req.params.id, function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("show", {blog : blog });
    });    
});


// Edit form for Blog
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("edit", { blog : blog });
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


// creating server
app.listen(3000, function(req,res){
    console.log("server started...");
});