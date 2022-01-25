const User = require('../models/User.model');
const Resume = require('../models/Resume.model');
const notificationService = require("../services/notifications");

module.exports.get = (req, res, next) => {
    Resume.find({ _userId: req.user._id}, (err, resume) => {
            if(err) console.error(err);
            return res.send({ resume })
        })
} 

module.exports.add = async (req, res, next) => {
    let isNotif = await notificationService.notification(req.user._id);

    return res.render('resume-create', {
        isAuth: true, 
        isNotLogin: true, 
        user: req.user.toJSON(),
        isNotif
    })
}

module.exports.create = async (req, res, next) => {
    if(!req.body.lastname) return res.status(411).json({ "err": "Lastname is required" })
    if(!req.body.firstname) return res.status(411).json({ "err": "Firstname is required" })
    if(!req.body.birthdate) return res.status(411).json({ "err": "Birthdate is required" })
    if(!req.body.citizenship) return res.status(411).json({ "err": "Citizenship is required" })
    if(!req.body.email) return res.status(411).json({ "err": "Email is required" })
    if(!req.body.phone) return res.status(411).json({ "err": "Phone is required" })
    if(!req.body.country) return res.status(411).json({ "err": "Country is required" })
    if(!req.body.city) return res.status(411).json({ "err": "City is required" })
    if(!req.body.address) return res.status(411).json({ "err": "Address is required" })
    if(!req.body.careerObjective) return res.status(411).json({ "err": "Career objective is required" })
    if(!req.body.busyness) return res.status(411).json({ "err": "Busyness is required" })

    const user = await User.findOne({ _id: req.user._id });

    let resume = new Resume({
        avatarURL: user.avatarURL,
        _userId: req.user._id,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        patronymic: req.body.patronymic ? req.body.patronymic : "",
        sex: req.body.sex ? req.body.sex : "",
        birthdate: req.body.birthdate,
        citizenship: req.body.citizenship,
        email: req.body.email,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
        address: req.body.address,
        careerObjective: req.body.careerObjective,
        salaryObjective: req.body.salaryObjective ? req.body.salaryObjective : "",
        busyness: req.body.busyness,
        workExpirience: req.body.workExpirience ? req.body.workExpirience : "",
        education: req.body.education ? req.body.education : "",
        languages: req.body.languages ? req.body.languages : ""
    })

    resume.save();

    User.findById(resume._userId)
        .then(user => {
            if(!user) console.error("error");
            else {
                user.resume.push(resume._id);
                user.save();
            }
        })

    res.redirect('/user')
}

module.exports.visible = (req, res) => {
    Resume.findById(req.body.id)
        .then(resume => {
            resume.isPublished = !resume.isPublished;
            resume.save();
        })
}

module.exports.updateGET = (req, res) => {
    Resume.findById(req.params.id)
            .then(async resume => {
                let isNotif = await notificationService.notification(req.user._id);

                res.render('resume-update', {
                    isAuth: true, 
                    isNotLogin: true, 
                    user: req.user.toJSON(),
                    resume: resume.toJSON(),
                    isNotif
                })
        })
}

module.exports.update = (req, res, next) => {
    Resume.findById(req.params.id)
            .then(async resume => {
                console.log(resume)

                const user = await User.findOne({ _id: req.user._id });

                resume.avatarURL = user.avatarURL;
                resume.lastname = req.body.lastname || resume.lastname;
                resume.firstname = req.body.firstname || resume.firstname;
                resume.patronymic = req.body.patronymic || resume.patronymic;
                resume.sex = req.body.sex || resume.sex;
                resume.birthdate = req.body.birthdate || resume.birthdate;
                resume.citizenship = req.body.citizenship || resume.citizenship;
                resume.email = req.body.email || resume.email;
                resume.phone = req.body.phone || resume.phone;
                resume.country = req.body.country || resume.country;
                resume.city = req.body.city || resume.city;
                resume.address = req.body.address || resume.address;
                resume.careerObjective = req.body.careerObjective || resume.careerObjective;
                resume.salaryObjective = req.body.salaryObjective || resume.salaryObjective;
                resume.busyness = req.body.busyness || resume.busyness;
                resume.workExpirience = req.body.workExpirience || resume.workExpirience;
                resume.education = req.body.education || resume.education;
                resume.languages = req.body.languages || resume.languages;

                resume.save();
            })
        
    res.redirect('/user')
}

module.exports.all = (req, res) => {
    Resume.find({})
        .lean()
        .then(async resumes => {
            let isNotif = await notificationService.notification(req.user._id);

            res.render('resume-list', {
                isAuth: req.user && true, 
                isNotLogin: true, 
                user: req.user.toJSON(),
                resumes: resumes,
                isNotif
            })
        })
}

module.exports.resumeDetails = (req, res) => {
    let id = req.params.id;

    if(!req.isAuthenticated()) {
        Resume.findById(id)
            .then(resume => {
            return res.render('resume-detail', {
                isNotLogin: true,
                resume: resume.toJSON()
            });
        })
    } else {
        User.findById(req.user._id)
            .then(user => {
                Resume.findById(id)
                    .then(async resume => {
                        let isNotif = await notificationService.notification(req.user._id);

                        return res.render('resume-detail', {
                            isAuth: true,
                            isNotLogin: true,
                            user: user.toJSON(),
                            resume: resume.toJSON(),
                            isNotif
                        });
                    })

            })
    }
}