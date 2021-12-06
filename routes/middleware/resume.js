const Resume = require('../../models/Resume.model');

const resume = (req, res, next) => {
    Resume.findById(req.params.id)
        .then((resume) => {
            if (resume.isPublished) {
                return next()
            }

            return res.redirect("/resume")
        })
}

module.exports = resume;