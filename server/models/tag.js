var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    name: String,
    user: String,
    active: Boolean,
    timestamp: String
});

module.exports = mongoose.model('tag', tagSchema);    