var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProjectSchema = new Schema({
    name: { type: String, required: true, unique: true },
    duration: { type: Number },
    begin: { type: Date, required: true },
    end: { type: Date },
    created: { type: Date, default: Date.now },
    resources : [{type: Schema.ObjectId, ref: 'UserSchema'}]/*,
    items : [{type: Schema.ObjectId, ref: 'ItemSchema', required: true}],
    sprints : [{type: Schema.ObjectId, ref: 'SprintSchema', required: true}]*/
});

module.exports = mongoose.model('Project', ProjectSchema);