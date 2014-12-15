var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RightSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Right', RightSchema);