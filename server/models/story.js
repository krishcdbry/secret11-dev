var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storySchema = new Schema({
	content: String,
	title: String,
	type: String,
	author: Schema.ObjectId,
	active: Boolean,
	image: String,
	url : String,
	timestamp: String
});

module.exports = mongoose.model('story', storySchema);    