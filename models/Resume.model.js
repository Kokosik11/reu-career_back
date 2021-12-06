const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Resume = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    patronymic: { type: String },
    sex: { type: String },
    birthdate: { type: Date, required: true },
    citizenship: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    careerObjective: { type: String, required: true },
    salaryObjective: { type: String },
    busyness: { type: String, required: true },
    workExpirience: { type: String },
    education: { type: String },
    languages: { type: String },
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('Resume', Resume);