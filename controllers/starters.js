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
        var currentUser = req.user;
        res.render('starters-new', { currentUser });
    })

    // CREATE
        app.post("/starters/new", (req, res) => {
            var currentUser = req.user;
            if (req.user) {
                if (req.body.title == "" || req.body.content == ""){
                    res.render('errorNewStarter', {currentUser});
                // } else { // not working correctly. how do i check from here if the title is a repeat?
                //     console.log("unique? "+ req.body.title)
                //     if (!req.body.title.unique){
                //         res.render('errorTakenTitle', {currentUser, message: "Error: The title of your story must be unique. Someone has already submitted a story with that title."})
                    } else {
                var starter = new Starter(req.body);
                starter.authorName = req.user.username
                starter.author = req.user._id;
                starter.url = `/starters/${starter._id}`;
                // url = `/starters/${starter._id}`
                starter
                    .save()
                    .then(starter => {
                        return User.findById(req.user._id);
                    })
                    .then(user => {
                        user.starters.unshift(starter);
                        user.save();
                        // REDIRECT TO THE NEW Starter
                        res.redirect(`${starter.url}`);
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
                // }
            }
            } else {
                return res.status(401); // UNAUTHORIZED
            }

        });

        // SHOW
        app.get("/starters/:id", function (req, res) {
            // let story = ""
            // let count = 0
            var currentUser = req.user;
            Starter.findById(req.params.id).populate('threads').lean()
                .then(starter => {
//                     story+=starter.content + " "
//                     count+=1
//                     starter.threads.forEach(function(thread){
// //the logic and implementation of this is flawed. Supposed to create new paragraphs after 5 sentences...
//                         if (count < 5){
//                             story += thread.content + " "
//                             count += 1
//                         } else {
//                             story += "\n\n"
//                             count = 0
//                         }
//                     })
                    // console.log(story)
                    res.render("starters-show", { starter, currentUser });
                })
                .catch(err => {
                    console.log(err.message);
                });
        });

        //SHOW FORMATTED STORY

        app.get("/starters/:id/yarn", function (req, res) {
            let authors = "by "
            let authorsArray = [] // implement tomorrow
            let story = ""
            let count = 0
            var currentUser = req.user;
            Starter.findById(req.params.id).populate('threads').lean()
                .then(starter => {
                    story+=starter.content + " "
                    authors+= starter.authorName + " "
                    count+=1
                    starter.threads.forEach(function(thread){
//the logic and implementation of this is flawed. Supposed to create new paragraphs after 5 sentences...
                        if (count < 5){
                            story += thread.content + " "
                            count += 1
                        } else {
                            story += thread.content + "\n\n"
                            count = 0
                        }
                        authors+= "and " + thread.authorName + " "
                    })
                    console.log(story)
                    res.render("starters-show-story", { currentUser, starter, story, authors });
                })
                .catch(err => {
                    console.log(err.message);
                });
        });




        // EDIT a compliment by clicking on the edit link in the shown compliment
        app.get('/starters/:id/edit', (req, res) => {
            console.log("edit form")
            var currentUser = req.user;
          Starter.findById(req.params.id, function(err, starter) {
            res.render('starters-edit', {starter, currentUser });
          })
      });


        // UPDATE... does this replace EDIT? ...guess not...
        app.put('/starters/:id', (req, res) => {
        var currentUser = req.user;
        if (req.body.title == "" || req.body.content == ""){
            Starter.findById(req.params.id).then(starter => {
            res.render('errorEditStarter', {currentUser, starter}); //NEED TO MAKE AN ERROR PAGE FOR BOTH STARTERS AND THREADS FOR CORRECT REDIRECT
        });
        } else {
          Starter.findByIdAndUpdate(req.params.id, req.body).then(starter => {
              starter.authorName = req.user.username
              starter.author = req.user._id;
              starter.save()
              res.redirect(`/starters/${starter._id}`);
            })
            .catch(err => {
              console.log(err.message)
            })
        };
    });


        // DELETE one compliment from the delete button on the "shown" compliment page
        app.delete('/starters/:id', function (req, res) {
          var currentUser = req.user;
          console.log("starter id: "+req.params.id)
          Starter.findByIdAndRemove(req.params.id).then(starter => {
             res.redirect('/');
          }).catch((err) => {
            console.log(err.message);
          })
      });

};

//
// STRETCH CHALLENGE!!
// Can you make an author's username a link that displays that users's profile at /users/:username?
// Can you do the same for comments?
// Can you make a /profile route that loads the current user and displays their starters and comments?
