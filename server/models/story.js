var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storySchema = new Schema({
	content: String,
	title: String,
	type: String,
	author: String,
	active: Boolean,
	timestamp: String
});

module.exports = mongoose.model('story', storySchema);    