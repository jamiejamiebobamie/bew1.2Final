const jwt = require('jsonwebtoken');
const User = require("../models/user");

const Starter = require('../models/starter');
const slugify = require('slugify');
const Thread = require('../models/thread');




module.exports = app => {

//Jasmine Humbert's code:
// *******
    app.get('/sign-up', (req, res) => {
        let landing = false;
        var currentUser = req.user;
        if (currentUser) {
            res.redirect('/');
        } else {
            res.render('sign-up', currentUser, landing);
        }
    });
// *******

// SIGN UP POST
app.post("/sign-up", (req, res) => {
  // Create User and JWT
  const user = new User(req.body);
  user.save().then((user) => {
      var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      res.redirect('/');
      })
    .catch(err => {
      console.log(err.message);
      return res.status(400).send({ err: err });
    });

});



 // LOGIN
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  User.findOne({ username }, "username password")
    .then(user => {
      if (!user) {
        // User not found
        return res.status(401).send({ message: "Wrong Username or Password" });
      }
      // Check the password
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          return res.status(401).send({ message: "Wrong Username or password" });
        }
        // Create a token
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
          expiresIn: "60 days"
        });
        // Set a cookie and redirect to root
        res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// LOGOUT
app.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  res.redirect('/');
});

// LOGIN FORM
 app.get('/login', (req, res) => {
     let landing = false;
   res.render('login', { landing });
 });
//

// /user-profile route
app.get('/user-profile/:username', (req,res) => {
    var currentUser = req.user;
    var user = req.params.username
    const save = req.originalUrl
    let count = 0;
    let userId = ""
    let startersFalse;
    let startersTrue;

    for(i=0; i< save.length; i++){
        if (save[i] == "/"){
            count+=1
        } else if (count == 2 && save[i] != "/" && save[i] != "?"){
            userId += save[i]
        }
    }

    User.findOne({username: req.params.username})
      .then(user => {
              Starter.find({ author: user, "finished": false}).populate('author')
      .then(startersFalse => {
              Starter.find({ author: user, "finished": true}).populate('author')
      .then(startersTrue => {
      console.log(startersFalse);
          res.render('user-profile', {user: user, currentUser, date: user.createdAt.toDateString(), startersFalse, startersTrue});
                    });
                });
            });
        });

};
