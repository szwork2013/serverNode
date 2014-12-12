var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: { type: String, required: true, unique: true },
    begin: { type: Date },
    end: { type: Date },
    created: { type: Date, default: Date.now },
    tasks: [{
        type: { type: String, required: true},
        message: { type: String, required: true },
        created: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);