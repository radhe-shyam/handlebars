const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
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
app.get('/about', (req, res)=>{
    res.render('about');
});

app.listen(port, () => {
    console.log('Server started on:', port);
})