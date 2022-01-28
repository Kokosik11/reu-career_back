const Resume = require('../../models/Resume.model');

const resume = (req, res, next) => {
    Resume.findOne({ _id: req.params.id })
        .then((resume) => {
            console.log(resume)
            if (resume.isPublished) {
                return next()
            }

            return res.redirect("/resume")
        })
}

module.exports = resume;