const express = require('express');
const Router = express.Router();
const multer  = require("multer");

const Controller = require('../controllers/company.controller')

const auth = require('./middleware/auth.js')
const company = require('./middleware/company.js')

const upload = multer({dest:"static/uploads/company"});

Router.get('/success', auth, Controller.success);
Router.post('/create', upload.single("company-logo"), auth, Controller.create);
Router.get('/create', auth, company.isYourCompany, Controller.render);
Router.get('/me', auth, Controller.getMyCompany);
Router.get('/:id', company.company, Controller.getCompany);
Router.get('/', Controller.companies);

module.exports = Router;