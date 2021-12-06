const express = require('express');
const Router = express.Router();

const Controller = require('../controllers/resume.controller')

const auth = require('./middleware/auth.js')
const resume = require('./middleware/resume.js')

Router.post('/:id/update', auth, Controller.update);
Router.get('/:id/update', auth, Controller.updateGET);
Router.post('/visible', auth, Controller.visible);
Router.post('/add', auth, Controller.create);
Router.get('/add', auth, Controller.add);
Router.get('/user', auth, Controller.get);
Router.get('/:id', resume, Controller.resumeDetails);
Router.get('/', Controller.all);

module.exports = Router;