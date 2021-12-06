const express = require('express');
const Router = express.Router();

const Controller = require('../controllers/vacancy.controller')

const auth = require('./middleware/auth.js')

Router.post('/create', Controller.create);
Router.get('/', Controller.getAll)

module.exports = Router;