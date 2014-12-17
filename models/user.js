var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

// User schema
var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    right: {
        _id: {type: Schema.ObjectId, ref: 'RightSchema', required: true},
        name: {type: String, required: true}
    },
    roles: [
        {
            role: {
                _id: {type: Schema.ObjectId, ref: 'RoleSchema', required: true},
                name: {type: String, required: true}
            },
            project: {
                _id: {type: Schema.ObjectId, ref: 'ProjectSchema', required: true},
                name: {type: String, required: true}
            }
        }
    ],
    mail: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    notifications: [
        {
            type: { type: String, required: true},
            message: { type: String, required: true },
            created: { type: Date, default: Date.now }
        }
    ],
    active: {type: Boolean, default: true},

    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

// Bcrypt middleware on UserSchema
UserSchema.pre('save', function (next) {
    var user = this;
    console.log("presave");
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//Password verification
UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);

