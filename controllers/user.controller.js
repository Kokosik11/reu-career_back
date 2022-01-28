const User = require('../models/User.model');
const Resume = require('../models/Resume.model');
const subscribe = require('../services/subscribe');

const mongoose = require('mongoose');
const notificationService = require("../services/notifications");
const Vacancy = require('../models/Vacancy.model');
const Company = require('../models/Company.model');

module.exports.profile = (req, res, next) => {
    User.findById(req.user._id)
            .then(async user => {
                let isNotif = await notificationService.notification(req.user._id);

                return res.render('user-profile', { 
                    isAuth: true, 
                    isNotLogin: true, 
                    user: user.toJSON(),
                    isNotif
                });
            })
}

module.exports.updateProfile = (req, res, next) => {
    User.findByIdAndUpdate(req.user._id)
        .then(user => {
            // console.log(user)

            if(req.body.lastname) user.username.lastname = req.body.lastname;
            if(req.body.firstname) user.username.firstname = req.body.firstname;
            if(req.body.patronymic) user.username.patronymic = req.body.patronymic;
            if(req.email) user.email = req.body.email;
            if(req.phone) user.phone = req.body.phone;
            if(req.file) user.avatarURL = req.file.path.replace('static', '');
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
            return res.redirect('/company/'+req.params.id);
        } 
    });
} 

module.exports.unsubscribe = (req, res) => {
    subscribe.unsubscribe(req.user._id, req.params.id, (err, status) => {
        if(err) {
            return console.error(err);
        } 
        if(status) {
            return res.redirect('/company/'+req.params.id);
        } 
    });
}

module.exports.userResumes = async (req, res) => {
    try {
        let resumes = await Resume.find({ _userId: req.user._id, isPublished: { $eq: true } }).lean();
        let isNotif = await notificationService.notification(req.user._id);

        console.log(resumes)

        return res.render('resume-userlist', {
            isAuth: true,
            isNotLogin: true,
            user: req.user.toJSON(),
            resumes: resumes,
            isNotif,
        })

    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Server error" })
    }
}

module.exports.respond = async (req, res) => {
    const { vacancyId, resumeId } = req.params;

    try {
        if(mongoose.isValidObjectId(vacancyId) && mongoose.isValidObjectId(resumeId)) {
            console.log(vacancyId)
            let vacancy = await Vacancy.findOne({ _id: vacancyId });
            console.log(vacancy)

            let company = await Company.findOne({ _id: vacancy.company });
            console.log(company)
            let resume = await Resume.findOne({ _id: resumeId });
            
            let message = `<a href="/resume/${resume._id}">${resume.firstname}</a> откликнулся на <a href="/vacancy/${vacancy._id}">вашу вакансию</a>`
            
            company.notifications.push({ message });

            company.save();

            return res.redirect('/vacancy/' + vacancy._id);
        }
    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Server error" })
    }
}