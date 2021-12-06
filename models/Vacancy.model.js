const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Vacancy = new Schema({
    // _companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    salary: { type: Number },
    location: { type: String, required: true },
    busyness: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    company: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' },
});

module.exports = mongoose.model('Vacancy', Vacancy);