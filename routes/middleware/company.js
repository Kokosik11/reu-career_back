const Company = require('../../models/Company.model');
const Vacancy = require('../../models/Vacancy.model');

const company = (req, res, next) => {
    Company.findById(req.params.id)
        .then((company) => {
            if(!company) return res.redirect("/");
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

const isYourVacancy = async (req, res, next) => {
    try {
        let vacancy = await Vacancy.findOne({ _id: req.params.id, company: req.user.company });
        console.log(vacancy)

        if(vacancy) {
            return next();
        }

        return res.redirect('/vacancy/' + req.params.id);
    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Server error" });
    }
}

module.exports = { company, isYourCompany, isYourVacancy };