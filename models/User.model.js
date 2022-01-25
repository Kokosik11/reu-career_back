const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const Fullname = new Schema({
    lastname: { type: String, default: "" },
    firstname: { type: String, default: "" },
    patronymic: { type: String, default: "" },
}, { _id: false })

const User = new Schema({
    username: {
        type: Fullname,
        default: {},
    },
    email: {
        type: String,
        unique: true,
        default: "",
    },
    avatarURL: { type: String, default: "/media/default-avatar.png" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    companyIsComfirmed: { type: Boolean, default: false },
    role: { type: String },
    emailConfirmed: { type: Boolean, default: false },
    hash: String,
    salt: String,
    phone: String,
    authStrategy: {
        type: String,
        default: "local",
    },
    resume: {
        type: [String],
    }
})

User.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

User.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash
}

module.exports = mongoose.model('User', User);