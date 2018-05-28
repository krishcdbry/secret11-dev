var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema({
	reply: String,
	story: Schema.ObjectId,
	user: Schema.ObjectId,
	timestamp: String
});

module.exports = mongoose.model('reply', replySchema);    