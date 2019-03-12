const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthentication } = require('../helper/auth');

//load model
require('../models/Idea');
const Idea = mongoose.model('ideas');


router.get('/add', ensureAuthentication, (req, res) => {
    res.render('./ideas/add');
});

router.get('/edit/:id', ensureAuthentication, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        if (idea.user == req.user.id) {
            res.render('./ideas/edit', { idea });
        } else {
            req.flash("error_msg", "Not authorized");
            res.redirect('./ideas/');
        }
    })
});

router.get('/', ensureAuthentication, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({ date: "desc" })
        .then(ideas => {
            res.render('./ideas/index', { ideas });
        })
});

router.post('/', ensureAuthentication, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: "Please provide the title" });
    }
    if (!req.body.details) {
        errors.push({ text: "Please provide the details" });
    }

    if (errors.length > 0) {
        res.render('./ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };

        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Idea added');
                res.redirect('/ideas');
            })
    }
});

router.put('/:id', ensureAuthentication, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        return idea.save();
    }).then(() => {
        req.flash('success_msg', 'Idea updated');
        res.redirect('/ideas');
    })
});

router.delete('/:id', ensureAuthentication, (req, res) => {
    Idea.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('error_msg', 'Idea removed');
            res.redirect('/ideas');
        });
})


module.exports = router;
