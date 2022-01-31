const express = require('express');
const Router = express.Router();

const Controller = require('../controllers/vacancy.controller')

const auth = require('./middleware/auth.js')
const { isYourVacancy } = require("./middleware/company");

Router.post('/:id/remove', isYourVacancy, auth, Controller.remove);
Router.post('/:id/update', isYourVacancy, auth, Controller.update);
Router.get('/:id/update', isYourVacancy, auth, Controller.updateGET);
Router.post('/create', auth, Controller.create);
Router.get('/add', auth, Controller.createPage);
Router.get('/:id', Controller.getOne);
Router.get('/', Controller.getAll);

module.exports = Router;