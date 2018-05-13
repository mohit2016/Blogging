var mongoose = require("mongoose");

// Blog Schema
var BlogSchema = new mongoose.Schema({
    title : String,
    description : String,
    image : String,
    date : { type: Date, default : Date.now()},
    author : {
        id  : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
]
});

// Creating Model corresponding to the Schema
module.exports =  mongoose.model("Blog", BlogSchema);
