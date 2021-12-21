const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Notification = new Schema({
    message: String,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = Notification;