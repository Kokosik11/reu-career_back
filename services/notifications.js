const Company = require('../models/Company.model');
const User = require('../models/User.model');

const read = async (userId) => {
    const company = await Company.findOne({ _userId: userId })

    if(company) {
        company.notifications = company.notifications.map(notif => {
            notif.read = true
            return notif;
        });
        company.save();
        await Company.findOneAndUpdate(
            { _userId: userId },
            { $set: company },
            { new: true });
    }

    return false;
}

const notification = async (userId) => {
    const company = await Company.findOne({ _userId: userId })

    if(company) {
        console.log(company.notifications.some(notif => notif.read === false))
        return company.notifications.some(notif => notif.read === false);
    }

    return false;
}

module.exports = { notification, read }