//Starters.js route

const Starter = require('../models/starter');
const User = require('../models/user');

module.exports = (app) => {

    // INDEX
        app.get('/', (req, res) => {
            var currentUser = req.user;
            // res.render('home', {});
            console.log(req.cookies);
            Starter.find().populate('author')
            .then(starters => {
                console.log(starters)
                res.render('starters-index', { starters, currentUser });
                // res.render('home', {});
            }).catch(err => {
                console.log(err.message);
            })
        })

    // GET NEW POST FORM
    app.get('/starters/new', (req, res) => {
        res.render('starters-new');
    })

    // CREATE
        app.post("/starters/new", (req, res) => {
            if (req.user) {
                var starter = new Starter(req.body);
                starter.author = req.user._id;
                starter.url = `/starters/${starter._id}`;
                starter
                    .save()
                    .then(starter => {
                        return User.findById(req.user._id);
                    })
                    .then(user => {
                        user.starters.unshift(starter);
                        user.save();
                        // REDIRECT TO THE NEW POST
                        res.redirect(`/starters/${starter._id}`);
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
            } else {
                return res.status(401); // UNAUTHORIZED
            }
        });
        // SHOW
        app.get("/starters/:id", function (req, res) {
            var currentUser = req.user;
            Starter.findById(req.params.id).populate('threads').lean()
                .then(starter => {
                    res.render("starters-show", { starter, currentUser });
                })
                .catch(err => {
                    console.log(err.message);
                });
        });



};

//
// STRETCH CHALLENGE!!
// Can you make an author's username a link that displays that users's profile at /users/:username?
// Can you do the same for comments?
// Can you make a /profile route that loads the current user and displays their starters and comments?
