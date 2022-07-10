var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    emailId: String,
    pass: String,
    isVerified: Boolean
}, {
    timestamps: true
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;