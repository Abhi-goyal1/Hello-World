const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
   googleId: String,
  username: String,
  displayName: String,
   email:{
    type: String,
    required: true,
   },
   
});



userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });


const user = mongoose.model("user", userSchema);
module.exports = user;