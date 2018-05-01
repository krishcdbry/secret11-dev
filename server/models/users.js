var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
   username:String,
   email:String,
   password:String,
   image:String,
   description:String,
   gender:String,
   _enabled:Boolean
});

module.exports = mongoose.model('user', userSchema);    