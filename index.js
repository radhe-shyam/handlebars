const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidjot', {
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to mongo');
}).catch(err => {
    console.log('Mongo connection failed=>', err);
})
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
const port = 5000;
app.get('/', (req, res) => {
    res.render('index', {
        note: 'Welcome note'
    });
});
app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log('Server started on:', port);
})