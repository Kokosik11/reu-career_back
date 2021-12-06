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

module.exports = company;