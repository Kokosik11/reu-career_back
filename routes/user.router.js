const express = require('express');
const multer  = require("multer");
const Controller = require('../controllers/user.controller')
const Router = express.Router();

const auth = require('./middleware/auth.js')
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "static/uploads/avatars")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const upload = multer({ storage });

Router.get('/unsubscribe/:id', auth, Controller.unsubscribe);
Router.get('/subscribe/:id', auth, Controller.subscribeToCompany);
Router.post('/update', auth, upload.single("avatar"), Controller.updateProfile);
Router.get('/', auth, Controller.profile);

module.exports = Router;