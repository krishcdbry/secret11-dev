var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var followerSchema = new Schema({
	user: Schema.ObjectId,
	follower: Schema.ObjectId,
	timestamp: String
});

module.exports = mongoose.model('follower', followerSchema);    