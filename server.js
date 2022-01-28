const config = require('config');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars')
const csrf = require('csurf')
const path = require('path');
const chalk = require('chalk');
const env = require('dotenv');
const moment = require('moment')

require('./config/db');

const app = express();

require("./authenticate")

const DateFormats = {
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};
// Use UI.registerHelper..
Handlebars.registerHelper("formatDate", function(datetime, format) {
    if (moment) {
    // can use other formats like 'lll' too
        format = DateFormats[format] || format;
        return moment(datetime).locale('ru').format(format);
    }
    else {
        return datetime;
    }
});

const isProduction = process.env.MODE === "production";

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.db.host
    }),
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: eval(config.db.maxAge)
    }
}))

app.engine(
    'handlebars',
    handlebars({ defaultLayout: 'main' })
)

app.set('views', './views');
app.set('view engine', 'handlebars');
//
// const csrfMiddleware = (req, res, next) => {
//     res.locals.csrf = req.csrfToken();
//     next();
// }

app.use(express.urlencoded({ extended: true }));
// app.use(csrf());
// app.use(csrfMiddleware);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'static')))

const PORT = process.env.PORT || 3000;

const serverLog = (req, res, next) => {
    if(!isProduction) {
        let method = req.method === "POST" ? chalk.blue(`[${req.method}]`) : chalk.green(`[${req.method}]`);
        let msg = chalk.gray(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]`) 
                + method
                + `: ${req.originalUrl}`;
        console.log(msg);
        // next();
    }
    next();
}

const notificationService = require('./services/notifications');

app.use(serverLog);

app.use("/notifications", require("./routes/notifications.router"));
app.use("/resume", require("./routes/resume.router.js"));
app.use("/company", require("./routes/company.router.js"));
app.use("/user", require("./routes/user.router.js"));
app.use("/vacancy", require('./routes/vacancy.router.js'));
app.use("/", require('./routes/home.router.js'));

app.use((req, res, next) => {
    res.send("<h1>Page not found</h1>");
})

if(!isProduction) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server listen on http://localhost:${PORT}/`);
})
