const Company = require('../../models/Company.model');

const company = (req, res, next) => {
    Company.findById(req.params.id)
        .then((company) => {
            if (company.isConfirmed) {
                return next()
            }

            return res.redirect("/company")
        })
}

const isYourCompany = (req, res, next) => {
    Company.find({ _userId: req.user._id }).then((company) => {
        if(company.length) return res.redirect("/company/me");
        return next();
    })
}

module.exports = { company, isYourCompany };