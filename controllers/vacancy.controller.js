const Vacancy = require('../models/Vacancy.model');
const User = require("../models/User.model");
const Company = require("../models/Company.model");
const notificationService = require("../services/notifications");

const getAllFunc = () => {
    return Vacancy.find({})
}

module.exports.getAllFunc = getAllFunc;

module.exports.getAll = (req, res, next) => {
    getAllFunc().then(vacancies => {
        if(vacancies.length === 0) return res.status(500).json({ "message": "vacancies is empty" });
        return res.status(200).json({ "vacancies": vacancies })
    })
}

module.exports.create = async (req, res, next) => {
    try {
        if(!req.body.title) return res.status(411).json({ "err": "Title is required" })
        if(!req.body.content) return res.status(411).json({ "err": "Content is required" })
        if(!req.body.salary) return res.status(411).json({ "err": "Salary is required" })
        if(!req.body.location) return res.status(411).json({ "err": "Location is required" })
        if(!req.body.busyness) return res.status(411).json({ "err": "Busyness is required" })

        let company = await Company.findOne({ _id: req.user.company });

        let vacancy = new Vacancy({
            title: req.body.title,
            content: req.body.content,
            salary: req.body.salary,
            location: req.body.location,
            busyness: req.body.busyness,
            company: req.user.company,
            logoURL: company.logoURL,
        })

        vacancy.save();

        return res.redirect("/company/me")
    } catch (e) {
        console.log(e);
        res.status(501).json({ message: "Server error" })
    }

}

module.exports.createPage = (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            if(!user) console.log("User not found")
            Company.findById(user.company)
                .then(async company => {
                    if(!company) return res.redirect('/');
                    if(company && company.isConfirmed) {
                        let isNotif = await notificationService.notification(req.user._id);
                        return res.render('vacancy-create', {
                            isAuth: true,
                            isNotLogin: true,
                            user: user.toJSON(),
                            company: company.toJSON(),
                            isNotif
                        })
                    }
                })
        })
}

module.exports.getOne = async (req, res) => {
    try {
        let vacancy = await Vacancy.findOne({ _id: req.params.id });
        let company = await Company.findOne({ _id: vacancy.company });

        if(!req.isAuthenticated()) {
            return res.render('vacancy-page', {
                isNotLogin: true,
                vacancy: vacancy.toJSON(),
                company: company.toJSON(),
            });
        }

        let user = await User.findOne({ _id: req.user._id });
        let isNotif = await notificationService.notification(req.user._id);

        return res.render('vacancy-page', {
            isAuth: true,
            isNotLogin: true,
            user: user.toJSON(),
            vacancy: vacancy.toJSON(),
            company: company.toJSON(),
            isCreator: company._userId.equals(req.user._id),
            isNotif
        })

    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Server error"})
    }
}

module.exports.updateGET = async (req, res) => {
    try {
        let vacancy = await Vacancy.findOne({ _id: req.params.id });
        let isNotif = await notificationService.notification(req.user._id);

        if(vacancy && req.isAuthenticated) {
            return res.render('vacancy-update', {
                isAuth: true,
                isNotLogin: true,
                user: req.user.toJSON(),
                vacancy: vacancy.toJSON(),
                isNotif,
            })
        }

        return res.redirect('/vacancy/' + vacancy._id);
    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Server error" })
    }
}

module.exports.update = async (req, res) => {
    try {
        let vacancyUpd = {};

        if(req.body.title) vacancyUpd.title = req.body.title;
        if(req.body.salary) vacancyUpd.salary = req.body.salary;
        if(req.body.location) vacancyUpd.location = req.body.location;
        if(req.body.busyness) vacancyUpd.busyness = req.body.busyness;
        if(req.body.content) vacancyUpd.content = req.body.content;

        let vacancy = await Vacancy.findOneAndUpdate(
            { _id: req.body._id },
            { $set: vacancyUpd },
            { now: true },
        )

        console.log(vacancy);

        return res.redirect('/vacancy/' + req.body._id);
    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Server error" })
    }
}


module.exports.remove = async (req, res) => {
    try {
        console.log(req.params.id)
        let vacancy = await Vacancy.findOneAndDelete({ _id: req.params.id })

        return res.redirect('/');
    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Server error" })
    }
}