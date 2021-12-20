const User = require('../models/User.model');
const subscribe = require('../services/subscribe');

const mongoose = require('mongoose');

module.exports.profile = (req, res, next) => {
    User.findById(req.user._id)
            .then(user => {
                return res.render('user-profile', { 
                    isAuth: true, 
                    isNotLogin: true, 
                    user: user.toJSON(),
                });
            })
}

module.exports.updateProfile = (req, res, next) => {
    User.findByIdAndUpdate(req.user._id)
        .then(user => {
            console.log(user)
            user.username.lastname = req.body.lastname ? req.body.lastname : '';
            user.username.firstname = req.body.firstname ? req.body.firstname : '';
            user.username.patronymic = req.body.patronymic ? req.body.patronymic : '';
            user.email = req.body.email ? req.body.email : '';
            user.phone = req.body.phone ? req.body.phone : '';
            user.avatarURL = req.body.avatarURL ? req.body.avatarURL : '';

            user.save();
        }) 

    res.redirect('/user')
}

module.exports.subscribeToCompany = (req, res) => {
    subscribe.subscribeUserToCompany(req.user._id, req.params.id, (err, status) => {
        if(err) {
            return console.error(err);
        } 
        if(status) {
            console.log("hi")
            return res.redirect('/company/'+req.params.id);
        } 
    });
} 