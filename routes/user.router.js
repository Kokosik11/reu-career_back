const express = require('express');
const multer  = require("multer");
const Controller = require('../controllers/user.controller')
const Router = express.Router();

const auth = require('./middleware/auth.js')

const upload = multer({dest:"static/uploads/company"});

Router.post('/update', auth, Controller.updateProfile);
Router.get('/', auth, Controller.profile);

module.exports = Router;