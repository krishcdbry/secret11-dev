var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
	story: Schema.ObjectId,
    user: Schema.ObjectId,
	timestamp: String
});

module.exports = mongoose.model('answer', answerSchema);    