const Company = require('../models/Company.model');
const User = require('../models/User.model');
const Subscribe = require('../models/Subscribe.model')
const subscribe = require('../services/subscribe')

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
      .then(user => {
          return res.render('add-company', {
              isAuth: true,
              isNotLogin: true,
              user: user.toJSON(),
              error: error.toJSON()
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
        .then(user => {
            return res.render('add-company', {
                isAuth: true,
                isNotLogin: true,
                user: user.toJSON(),
            });
        })
}

module.exports.success = (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            if(!user) console.log("User not found")
            Company.findById(user.company)
                .then(company => {
                    if(!company) return res.status(411).json({ "err": "Company is defined" })
                    if(company && company.isConfirmed) {
                        return res.send("Company page")
                    }
                    if(company && !company.isConfirmed) {
                        return res.render('success-comp', {
                            isAuth: true,
                            isNotLogin: true,
                            user: user.toJSON(),
                            company: company.toJSON()
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
    Company.findById(companyId)
        .then(async company => {
            if(req.isAuthenticated()) {
                let options = { 
                    isAuth: true, 
                    isNotLogin: true, 
                    user: req.user.toJSON(),
                    company: company.toJSON(),
                    isCreator: company._userId.equals(req.user._id)
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
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }
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