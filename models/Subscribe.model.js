const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Sybscribe = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    _companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company'},
});

module.exports = mongoose.model('Sybscribe', Sybscribe);