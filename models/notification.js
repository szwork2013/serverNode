var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    type: { type: String, required: true},
    message: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);