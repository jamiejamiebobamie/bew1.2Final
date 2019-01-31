const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

//middleware for JSON data
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

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


const Post = require('./models/post');
const posts = require('./controllers/posts');//(app);

// Set db
const db = require('./data/reddit-db');

app.get('/', (req, res) => {
    Post.find({})
      .then(posts => {
        res.render("posts-index", { posts });
      })
      .catch(err => {
        console.log(err.message);
      });
    res.render('posts-index');
})

app.get('/posts/new', (req, res) => {
    res.render('posts-new');
})

app.listen(port);

module.exports = app;
