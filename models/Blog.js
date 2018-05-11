var mongoose = require("mongoose");

// Blog Schema
var BlogSchema = new mongoose.Schema({
    title : String,
    description : String,
    image : String,
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
]
});

// Creating Model corresponding to the Schema
module.exports =  mongoose.model("Blog", BlogSchema);
