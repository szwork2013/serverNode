var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },

    estimatedTime: { type: Number },
    realTime: { type: Number },

    leftTimes: [
        {
            time: { type: Number, required: true},
            date: { type: Date, default: Date.now}
        }
    ],

    tasks: [
        {type: Schema.ObjectId, ref: 'TaskSchema'}
    ],
    comments: [
        {type: Schema.ObjectId, ref: 'CommentSchema'}
    ],

    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);