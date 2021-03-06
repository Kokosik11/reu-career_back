const mongoose = require('mongoose');

const Notification = require('./Notification.model');

const Schema = mongoose.Schema;

const Company = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    isConfirmed: { type: Boolean, required: true, default: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    addPhone: { type: String, default: ''},
    logoURL: { type: String, default: '' },
    notifications: { type: [Notification], default: [] }
});

module.exports = mongoose.model('Company', Company);