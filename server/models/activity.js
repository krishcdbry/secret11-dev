var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
	user: String,
    type: {
        type: String,
        enum : ['new', 'reply', 'vote']
    },
    story : String,
    reply : String,
	timestamp: String
});

module.exports = mongoose.model('activity', answerSchema);    