const auth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
}

module.exports = auth;