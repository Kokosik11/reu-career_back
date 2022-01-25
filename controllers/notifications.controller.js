const User = require('../models/User.model');
const Company = require('../models/Company.model');
const notificationService = require("../services/notifications");

module.exports.render = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const company = await Company.findOne({ _userId: req.user._id });

        console.log(company.notifications);

        notificationService.read(req.user._id);

        return res.render('notifications', {
            isAuth: true,
            isNotLogin: true,
            user: user.toJSON(),
            notifications: company.toJSON().notifications
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server error" });
    }
}
