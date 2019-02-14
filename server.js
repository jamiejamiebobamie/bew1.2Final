const secret_salt = require('dotenv').config();

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();

app.use(cookieParser()); // Add this after you initialize express.

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
const Comment = require('./models/comment');
const comments = require('./controllers/comments.js')(app);
const User = require('./models/user.js');
const auth = require('./controllers/auth.js')(app);
const replies = require('./controllers/replies.js')(app);

const port = process.env.PORT || 13000;

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

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

//must come below const app, but before routes
app.use(bodyParser.urlencoded({ extended: true }));

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, '/public')));

// //heroku database.
// mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes'), { useNewUrlParser: true });

// local host database
mongoose.connect('mongodb://localhost/rotten-potatoes');

//views middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(port);

module.exports = app;
