const express = require('express');
const Router = express.Router();

const Controller = require('../controllers/home.controller')

const auth = require('./middleware/auth.js')

Router.get('/confirmEmail', Controller.confirmEmailGET);
Router.get('/confirmation/:email/:token', Controller.verifyUser);
Router.get('/logout', Controller.logout);

Router.post("/login", Controller.login);
Router.get("/login", Controller.loginGET)
Router.post("/signup", Controller.signup);
Router.get("/signup", Controller.signupGET);

Router.get('/me', auth, Controller.me)
Router.get('/', Controller.main)

module.exports = Router;