var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
	user: Schema.ObjectId,
    type: {
        type: String,
        enum : ['new', 'reply', 'vote']
    },
    story : Schema.ObjectId,
    reply : Schema.ObjectId,
	timestamp: String
});

module.exports = mongoose.model('activity', answerSchema);    