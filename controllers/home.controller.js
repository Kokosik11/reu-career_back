const User = require('../models/User.model');
const Token = require('../models/Token.model');

const { getAllFunc } = require('./vacancy.controller');

const nodemailer = require('nodemailer');
const config = require('config');
const crypto = require('crypto');

const passport = require("passport");

module.exports.signup = (req, res, next) => {
    let username = {
        lastname: "",
        firstname: req.body.firstname,
        patronymic: "",
    }

    if (req.body.password !== req.body.repeatpass) {
        return res.render("register", { err: "Пароль не совпадает" });
    }
    if (!req.body.email) {
        return res.render("register", { err: "E-mail обязателен!" });
    }
    if (!req.body.firstname) {
        return res.render("register", { err: "Имя обязателено!" });
    }
    if (!req.body.password) {
        return res.render("register", { err: "Пароль обязателен!" });
    }



    User.findOne({ email: req.body.email })
        .then((userDB) => {
            if(userDB) return res.render("register", { err: "Пользователь с таким e-mail зарегестрирован" });

            const user = new User({ email: req.body.email, username });
            user.setPassword(req.body.password)
            user.save((err, user) => {
                if(err) console.error(err);
            });


            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            token.save((err, token) => {
                if(err){
                    return res.status(500).send({msg:err.message});
                }

                let transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: config.email.USERNAME, pass: config.email.PASSWORD } });
                let mailOptions = { from: 'reu-career@gmail.com', to: user.email, subject: 'Account Verification Link', 
                text: 'Привет, '+ username.firstname +'!\n\n' + 'Пожалуйста, перейдите по ссылке, чтобы подтвердить почту: \n' + config.email.SENDHOST + 'confirmation\/' + user.email + '\/' + token.token + '\n\nЕсли вы нигде не регестрировались под этим email адресом, проигнорируйте это сообщение \n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                    } else {
                        res.redirect('/confirmEmail');
                    }
                })
            })
        })
}

module.exports.verifyUser = (req, res, next) => {
    Token.findOne({ token: req.params.token })
        .then(token => {
            if(token) {
                User.findOne({ _id: token._userId })
                    .then(user => {
                        if(user.email === req.params.email) {
                            user.emailConfirmed = true;
                            user.save(err => {
                                if(err) res.status(500).send({ err });
                            })

                            return res.redirect('/login');
                        }
                    })
            }
        })
}

module.exports.signupGET = (req, res) => {
    res.render("register", { isNotLogin: false });
}

module.exports.loginGET = (req, res) => {
    res.render("login", { isNotLogin: false });
}

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if(err) return next(err);
        if(!user) {
            return res.render("login", { err: "Неправильный e-mail или пароль" });
        }
        if(!user.emailConfirmed) {
            return res.render("login", { err: "E-mail не подтверждён! Чтобы продолжить, подтвердите его"})
        }
        req.logIn(user, err => {
            if(err) return next(err);
            res.redirect(req.session.returnTo || '/');
            delete req.session.returnTo;
            // return next();
        });
    })(req, res, next);
}

module.exports.main = (req, res) => {
    if(!req.isAuthenticated()) {
        return res.render('home', { isNotLogin: true });
    } else {
        User.findById(req.user._id)
            .then(user => {
                getAllFunc().then(vacancies => {
                    return res.render('home', {
                        isAuth: true,
                        isNotLogin: true,
                        user: user.toJSON(),
                        vacancies: vacancies
                    });
                })

            })
    }
}

module.exports.logout = (req, res) => {
    req.session.destroy(err => {
        if(err) throw err;
    })

    return res.redirect(req.session.returnTo || '/');
}

module.exports.me = (req, res, next) => {
    return res.send(req.user);
}

module.exports.confirmEmailGET = (req, res, next) => {
    return res.render('confirmEmail', { isNotLogin: true })
}

module.exports.sendEmail = (req, res, next) => {

}
