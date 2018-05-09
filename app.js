// Import Necessary Files
var express  = require('express');
    mongoose = require("mongoose");


var app = express();

// Use EJS as viewing template 
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost/Blogging"); //Database Connection Call

// Blog Schema
var BlogSchema = new mongoose.Schema({
    title : String,
    description : String,
    image : String
});

// Creating Model corresponding to the Schema
var Blog =  mongoose.model("Blog", BlogSchema);



// Blog.create({
//     title : "Second Post",
//     description : "I am very confused what to write here",
//     image : "https://pixabay.com/get/e835b2082bf3093ed1584d05fb1d4e97e07ee3d21cac104497f5c970a5eab0bc_340.jpg"
// },function(err,blog){
//     if(err)
//         console.log(err);
//     else
//         console.log(blog);
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



// creating server
app.listen(3000, function(req,res){
    console.log("server started...");
});