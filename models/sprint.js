var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SprintSchema = new Schema({
    number: { type: String, required: true },
    duration: { type: Number },
    begin: { type: Date, required: true },
    end: { type: Date },
    velocity: { type: Number },

    resources: [
        {type: Schema.ObjectId, ref: 'UserSchema'}
    ],
    items: [
        {type: Schema.ObjectId, ref: 'ItemSchema'}
    ],
    comments: [
        {type: Schema.ObjectId, ref: 'CommentSchema'}
    ],

    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sprint', SprintSchema);