const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Token = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expires: { type: Date, default: Date.now, index: { expires: 86400000 } }
});

module.exports = mongoose.model('Token', Token);