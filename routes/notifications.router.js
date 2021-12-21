const express = require('express');
const Router = express.Router();

const Controller = require('../controllers/notifications.controller')

const auth = require('./middleware/auth.js')

Router.get('/', auth, Controller.render)

module.exports = Router;