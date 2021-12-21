const User = require('../models/User.model');

module.exports.render = (req, res, next) => {
    User.findById(req.user._id)
        .then(user => {

            return res.render('notifications', { 
                isAuth: true, 
                isNotLogin: true, 
                user: user.toJSON(),
            });
        })
}
