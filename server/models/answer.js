var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
	story: String,
    user: String,
	timestamp: String
});

module.exports = mongoose.model('answer', answerSchema);    