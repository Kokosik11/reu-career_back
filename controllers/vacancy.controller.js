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

    vacancy.save((err, vacancy) => {
        if(err) return res.status(411).json({ "err": err });
        res.status(200).json({ "message": vacancy });
    })

    return res.redirect("/company/me")
}

module.exports.createPage = (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            if(!user) console.log("User not found")
            Company.findById(user.company)
                .then(async company => {
                    if(!company) return res.status(411).json({ "err": "Company is defined" })
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
        let user = await User.findOne({ _id: req.user._id });
        let vacancy = await Vacancy.findOne({ _id: req.params.id });
        let isNotif = await notificationService.notification(req.user._id);
        let company = await Company.findOne({ _id: req.user.company });

        if(!req.isAuthenticated()) {
            return res.render('vacancy-page', { isNotLogin: true });
        }

        return res.render('vacancy-page', {
            isAuth: true,
            isNotLogin: true,
            user: user.toJSON(),
            vacancy: vacancy.toJSON(),
            company: company.toJSON(),
            isNotif
        })

    } catch (e) {
        console.log(e);
        res.status(501).json({ message: "Server error"})
    }
}