const Company = require('../models/Company.model');
const User = require('../models/User.model');
const Vacancy = require('../models/Vacancy.model');
const Subscribe = require('../models/Subscribe.model')
const subscribe = require('../services/subscribe')
const notificationService = require("../services/notifications");

const getAllFunc = () => {
    return Company.find({})
}

module.exports.getAllFunc = getAllFunc;

module.exports.getAll = (req, res, next) => {
    getAllFunc().then(companies => {
        if(companies.length === 0) return res.status(500).json({ "message": "vacancies is empty" });
        return res.status(200).json({ "companies": companies })
    })
}

module.exports.create = (req, res, next) => {
    let error = null;

    if(!req.body.name) error = { mes: "Name is required" }
    if(!req.body.content) error = { mes: "Content is required" }
    if(!req.file) error = { mes: "Logo is required" }
    if(!req.body.address) error = { mes: "Location is required" }
    if(!req.body.email) error = { mes: "Email is required" }
    if(!req.body.phone) error = { mes: "Phone is required" }

    if(error) {
      User.findById(req.user._id)
      .then(async user => {
          let isNotif = await notificationService.notification(req.user._id);

          return res.render('add-company', {
              isAuth: true,
              isNotLogin: true,
              user: user.toJSON(),
              error: error.toJSON(),
              isNotif

          });
      })
    }
    
    let company = new Company({
        _userId: req.user._id,
        name: req.body.name,
        content: req.body.content,
        logoURL: req.file.path.replace("static", ""),
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        addPhone: req.body.addPhone ? req.body.addPhone : "",
    })

    company.save();

    User.findById(company._userId)
        .then(user => {
            if(!user) console.error("error");
            else {
                user.company = company;
                user.save();
            }
        })

    res.redirect('/company/success')
}

module.exports.render = (req, res) => {
    User.findById(req.user._id)
        .then(async user => {
            let isNotif = await notificationService.notification(req.user._id);

            return res.render('add-company', {
                isAuth: true,
                isNotLogin: true,
                user: user.toJSON(),
                isNotif

            });
        })
}

module.exports.success = (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            if(!user) console.log("User not found")
            Company.findById(user.company)
                .then(async company => {
                    if(!company) return res.status(411).json({ "err": "Company is defined" })
                    if(company && company.isConfirmed) {
                        return res.send("Company page")
                    }
                    if(company && !company.isConfirmed) {
                        let isNotif = await notificationService.notification(req.user._id);
                        return res.render('success-comp', {
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

module.exports.companies = (req, res) => {
    Company.find({}, function(err, companies) {
        if(err) {
            console.log(err);
            return res.sendStatus(400);
        }

        let companyArr = companies.filter(company => company.isConfirmed === true)

        if(req.isAuthenticated()) {
            return res.render('companies', { isAuth: true, isNotLogin: true, user: req.user.toJSON(), companies: [...companyArr] });
        }
        return res.render('companies', { isNotLogin: true, companies: [...companyArr] });
    }).lean()
}

module.exports.getCompany = async (req, res) => {
    const companyId = req.params.id;

    let vacancies = await Vacancy.find({ company: companyId });

    Company.findById(companyId)
        .then(async company => {
            if(!company) return res.status(404).json({ message: "Company not found"})
            if(req.isAuthenticated()) {
                let isNotif = await notificationService.notification(req.user._id);
                let options = { 
                    isAuth: true, 
                    isNotLogin: true, 
                    user: req.user.toJSON(),
                    company: company.toJSON(),
                    isCreator: company._userId.equals(req.user._id),
                    vacancies,
                    isNotif
                }

                options.status = await subscribe.isSubscribed(req.user._id, req.params.id)

                return res.render('company', options);
            }

            return res.render('company', { 
                isNotLogin: true, 
                company: company.toJSON(),
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(501).json("Error");
        })
}

module.exports.getMyCompany = (req, res) => {
    User.findById(req.user._id)
    .then(user => {
        Company.findById(req.user.company)
            .then(company => {
                res.redirect('/company/'+company._id);            
            })
    }) 
}

module.exports.update = async (req, res) => {
    let error = null;

    if(error) {
        User.findById(req.user._id)
            .then(async user => {
                let isNotif = await notificationService.notification(req.user._id);

                return res.render('add-company', {
                    isAuth: true,
                    isNotLogin: true,
                    user: user.toJSON(),
                    error: error.toJSON(),
                    isNotif

                });
            })
    }

    let companyData = {}

    if(req.body.name) companyData.name = req.body.name;
    if(req.body.content) companyData.content = req.body.content;
    if(req.file) companyData.logoURL = req.file.path.replace("static", "");
    if(req.body.address) companyData.address = req.body.address;
    if(req.body.email) companyData.email = req.body.email;
    if(req.body.phone) companyData.phone = req.body.phone;
    if(req.body.addPhone) companyData.addPhone = req.body.addPhone;

    let company = await Company.findOneAndUpdate(
            { _userId: req.user._id },
        { $set: companyData },
        { now: true },
        )

    return res.redirect('/company/me')
}

module.exports.updateGET = (req, res) => {
    User.findById(req.user._id)
        .then(async user => {
            let isNotif = await notificationService.notification(req.user._id);
            let company = await Company.findOne({ _userId: req.user._id });

            return res.render('company-edit', {
                isAuth: true,
                isNotLogin: true,
                user: user.toJSON(),
                company: company.toJSON(),
                isNotif

            });
        })
}