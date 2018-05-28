var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storyTagSchema = new Schema({
	story: Schema.ObjectId,
    tag: Schema.ObjectId
});

module.exports = mongoose.model('storytag', storyTagSchema);    