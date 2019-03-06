const express = require('express');
const port = 5000;
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//load models
require('./models/Idea');
const Idea = mongoose.model('ideas');

mongoose.connect('mongodb://localhost/vidjot', {
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to mongo');
}).catch(err => {
    console.log('Mongo connection failed=>', err);
});


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//body parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//_method override middleware

app.use(methodOverride('_method'));

//request methods
app.get('/', (req, res) => {
    res.render('index', {
        note: 'Welcome note'
    });
});
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/ideas/add', (req, res) => {
    res.render('./ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        res.render('./ideas/edit', { idea });
    })
});

app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: "desc" })
        .then(ideas => {
            res.render('./ideas/index', { ideas });
        })
});

app.post('/ideas', (req, res) => {
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
            details: req.body.details
        };

        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
});

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        return idea.save();
    }).then(() => {
        res.redirect('/ideas');
    })
});

app.delete('/ideas/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
    .then(() => {
        res.redirect('/ideas');
    });
})

app.listen(port, () => {
    console.log('Server started on:', port);
})