const express = require('express');
const Router = express.Router();

const Controller = require('../controllers/vacancy.controller')

const auth = require('./middleware/auth.js')
const company = require("./middleware/company");

Router.post('/create', auth, Controller.create);
Router.get('/add', auth, Controller.createPage);
Router.get('/:id', Controller.getOne);
Router.get('/', Controller.getAll);

module.exports = Router;