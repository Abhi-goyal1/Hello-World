const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
  //  linkedinId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  username: String,
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    url :String,
    filename : String,
   },
  
  
   
});



userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });


const user = mongoose.model("user", userSchema);
module.exports = user;