var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    name: String,
    user: Schema.ObjectId,
    active: Boolean,
    count: String,
    timestamp: String
});

module.exports = mongoose.model('tag', tagSchema);    