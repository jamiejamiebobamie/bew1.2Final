const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

//middleware for JSON data
const bodyParser = require('body-parser');

//middleware for putting something when you post it
const methodOverride = require('method-override');

const port = process.env.PORT || 17000;

//must come below const app, but before routes
app.use(bodyParser.urlencoded({ extended: true }));

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))


//local host database
//mongoose.connect('mongodb://localhost/rotten-potatoes');

//heroku database.
mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes'), { useNewUrlParser: true });


//views middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
    res.render('index');
})

app.listen(port);


module.exports = app;
