var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storyTagSchema = new Schema({
	story: String,
    tag: String
});

module.exports = mongoose.model('storytag', storyTagSchema);    