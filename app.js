const dotenv = require('dotenv').config();

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();

app.use(cookieParser()); // Add this after you initialize express.

const exphbs = require('express-handlebars');

const mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

// Set db
const db = require('./data/final-db');

//middleware for JSON data
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const slugify = require('slugify');

//middleware for putting something when you post it
const methodOverride = require('method-override');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

const Starter = require('./models/starter');
const starters = require('./controllers/starters')(app);
const Thread = require('./models/thread');
const threads = require('./controllers/threads.js')(app);
const User = require('./models/user.js');
const auth = require('./controllers/auth.js')(app);
const port = process.env.PORT || 9000;

app.use(express.static('public'));

// //heroku database.
mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost/final-db'), { useNewUrlParser: true });

// local host database
// mongoose.connect('mongodb://localhost/final');

//views middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(port);

module.exports = app;
