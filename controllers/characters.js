//characters.js route

const Character = require('../models/character');
const User = require('../models/user');

module.exports = (app) => {

    // INDEX
        app.get('/', (req, res) => {
            var currentUser = req.user;
            // res.render('home', {});
            console.log(req.cookies);
            Character.find().populate('author')
            .then(characters => {
                console.log(characters)
                res.render('characters-index', { characters, currentUser });
                // res.render('home', {});
            }).catch(err => {
                console.log(err.message);
            })
        })

    // GET NEW POST FORM
    app.get('/characters/new', (req, res) => {
        res.render('characters-new');
    })

    // CREATE
        app.post("/characters/new", (req, res) => {
            if (req.user) {
                var character = new Character(req.body);
                character.author = req.user._id;
                character.url = `/characters/${character._id}`;
                character
                    .save()
                    .then(character => {
                        return User.findById(req.user._id);
                    })
                    .then(user => {
                        user.characters.unshift(character);
                        user.save();
                        // REDIRECT TO THE NEW POST
                        res.redirect(`/characters/${character._id}`);
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
            } else {
                return res.status(401); // UNAUTHORIZED
            }
        });
        // SHOW
        app.get("/characters/:id", function (req, res) {
            var currentUser = req.user;
            Character.findById(req.params.id).populate('storys').lean()
                .then(character => {
                    res.render("characters-show", { character, currentUser });
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
// Can you make a /profile route that loads the current user and displays their characters and comments?
