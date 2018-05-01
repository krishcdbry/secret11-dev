var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema({
	reply: String,
	story: String,
	user: String,
	timestamp: String
});

module.exports = mongoose.model('reply', replySchema);    