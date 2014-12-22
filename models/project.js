var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProjectSchema = new Schema({
    name: { type: String, required: true, unique: true },
/*    duration: { type: Number },*/
    begin: { type: String, required: true },
    end: { type: String },

    resources: [
        {type: Schema.ObjectId, ref: 'UserSchema'}
    ],
    sprints: [
        {type: Schema.ObjectId, ref: 'SprintSchema'}
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

module.exports = mongoose.model('Project', ProjectSchema);