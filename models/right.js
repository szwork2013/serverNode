var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RightSchema = new Schema({
    name: { type: String, required: true, unique: true },

    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Right', RightSchema);