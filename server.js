const config = require('config');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require('express-handlebars');
const path = require('path');
const chalk = require('chalk');
const env = require('dotenv');

require('./config/db');

const app = express();

require("./authenticate")


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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/notifications", serverLog, require("./routes/notifications.router"));
app.use("/resume", serverLog, require("./routes/resume.router.js"));
app.use("/company", serverLog, require("./routes/company.router.js"));
app.use("/user", serverLog, require("./routes/user.router.js"));
app.use("/vacancy", serverLog, require('./routes/vacancy.router.js'));
app.use("/", serverLog, require('./routes/home.router.js'));

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
