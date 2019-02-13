const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

const mongoose = require('mongoose');

// Set db
const db = require('./data/reddit-db');

//middleware for JSON data
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

//middleware for putting something when you post it
const methodOverride = require('method-override');

const Post = require('./models/post');
const posts = require('./controllers/posts')(app);

const port = process.env.PORT || 13000;

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

//must come below const app, but before routes
app.use(bodyParser.urlencoded({ extended: true }));

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

// //heroku database.
// mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes'), { useNewUrlParser: true });

// local host database
mongoose.connect('mongodb://localhost/rotten-potatoes');

//views middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(port);
