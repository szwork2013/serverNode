var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ItemSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: {
        _id: {type: Schema.ObjectId, ref: 'PrioritySchema', required: true},
        name: {type: String, required: true}
    },

    tasks: [
        {type: Schema.ObjectId, ref: 'TaskSchema'}
    ],
    comments: [
        {type: Schema.ObjectId, ref: 'CommentSchema'}
    ],

    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);