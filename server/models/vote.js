var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
	story: String,
    user: String,
	timestamp: String
});

module.exports = mongoose.model('vote', voteSchema);    