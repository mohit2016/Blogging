var mongoose = require('mongoose'),
    PassportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username : String,
    password : String
});

//It will add additional methods from passport to the Userschema
UserSchema.plugin(PassportLocalMongoose); 

module.exports =  mongoose.model("User", UserSchema);