const passport = require('passport');
const LocalStorage = require('passport-local').Strategy;
const User = require('./models/User.model');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStorage(
    { usernameField: 'email' },
    (email, password, done) => {
        User.findOne({ email: email}, (err, user) => {
            if(err) return done(err);
            if(!user) {
                return done(null, false, { message: 'Incorrect email' });
            }
            if(!user.validatePassword(password)) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        })
    }
));