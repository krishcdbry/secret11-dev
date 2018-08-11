var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema({
    name: String,
    active: Boolean,
    timestamp: String
});

module.exports = mongoose.model('topic', topicSchema);    