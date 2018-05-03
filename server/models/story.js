var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storySchema = new Schema({
	content: String,
	title: String,
	type: String,
	author: String,
	active: Boolean,
	image: String,
	timestamp: String
});

module.exports = mongoose.model('story', storySchema);    