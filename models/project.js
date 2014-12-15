var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProjectSchema = new Schema({
    name: { type: String, required: true, unique: true },
    duration: { type: Number },
    begin: { type: Date, required: true },
    end: { type: Date },
    created: { type: Date, default: Date.now }
/*    resources : [{type: Schema.ObjectId, ref: 'ProjectSchema', required: true}]*/
});

module.exports = mongoose.model('Project', ProjectSchema);