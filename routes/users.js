const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/', (req, res) => {
    let errors = [];

    if (!req.body.name) {
        errors.push({ text: "Please provide the name" });
    }

    if (!req.body.email) {
        errors.push({ text: 'Please provide the email' });
    }

    if (!req.body.password) {
        errors.push({ text: 'Please provide the password' })
    }

    if (!req.body.password2) {
        errors.push({ text: "Please provide the confirm password" });
    }

    if (req.body.password && req.body.password2 && req.body.password != req.body.password2) {
        errors.push({ text: 'Password and confirm password should be same.' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else
        res.send('register');
});
module.exports = router;