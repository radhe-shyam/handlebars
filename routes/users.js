const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/', async (req, res) => {
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

    if (req.body.email) {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            errors.push({ text: 'Email Already registered' });
        }
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        let newUser = new User(req.body);
        console.log('newUser=>>', newUser);
        bcrypt.genSalt(10, async (err, salt) => {
            console.log('salk=>>>',salt);
            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                console.log('hast=>>>>',hash);
                newUser.password = hash;
                await newUser.save();
                req.flash('success_msg', 'Registered successfully, please login');
                res.redirect('/users/login');
            })
        })
    }
});
module.exports = router;