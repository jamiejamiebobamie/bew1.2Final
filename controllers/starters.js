//Starters.js route

const Starter = require('../models/starter');
const User = require('../models/user');
const slugify = require('slugify');
const Thread = require('../models/thread');


module.exports = (app) => {

    // INDEX
        app.get('/', (req, res) => {
            let landing = true;
            let startersFalse;
            let startersTrue;
            var currentUser = req.user;
            Starter.find({"finished": false}).populate('author')
                    .then(startersFalse => {
                Starter.find({"finished": true}).populate('author')
                    .then(startersTrue => {
                    res.render('index-landing', {startersTrue: startersTrue, startersFalse: startersFalse, currentUser, landing });
                }).catch(err => {
                    console.log(err.message);
                })
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
                    } else {
                var starter = new Starter(req.body);
                starter.authorName = req.user.username
                starter.author = req.user._id;
                starter.index = req.body.title[0].toUpperCase();
                starter.finished = false;

                // let fillerThread = new Thread(" ");
                // fillerThread.save()
                // starter.threads.push(fillerThread)
                var slug = slugify(`${req.body.title}`)
                starter.slug = slug;//`${this.title}`); // some-string
                // starter.url = `/starters/${starter._id}`;
                starter.url = `/starters/${slug}`;
                // console.log(`hey /starters/${slug}`)
                starter
                    .save()
                    .then(starter => {
                        return User.findById(req.user._id);
                    })
                    .then(user => {
                        user.starters.unshift(starter);
                        user.save();
                        console.log("FINISHED " + starter.finished)
                        // REDIRECT TO THE NEW Starter
                        res.redirect(`${starter.url}`);
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
            }
            } else {
                return res.status(401); // UNAUTHORIZED
            }

        });

        // SHOW
        app.get("/starters/:slug", function (req, res) {
            var currentUser = req.user;
            let authorStart;
            let authors = "by "
            let authorsArray = [] // implement tomorrow
            let story = ""
            let count = 0
            Starter.findOne({slug: req.params.slug}).populate('threads').lean()
            // Starter.findById(req.params.id).populate('threads').lean()
                .then(starter => {
                    authorStart = req.user.username == starter.author.username;
                    // console.log("Bool "+ authorStart + "req.user " + req.user.username  + "starter author " + starter.author.username)
                    if (starter.finished == false){
                    res.render("starters-show", { starter, currentUser, authorStart });
                } else {
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
                    res.render("starters-show-story", { currentUser, starter, story, authors });
                }
                })
                .catch(err => {
                    console.log(err.message);
                });
        });

        //SHOW FORMATTED STORY
        app.get("/starters/:slug/yarn", function (req, res) {
            let authors = "by "
            let authorsArray = [] // implement tomorrow
            let story = ""
            let count = 0
            var currentUser = req.user;
            Starter.findOne({"slug": req.params.slug}).populate('threads').lean()
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




        // EDIT a story starter by clicking on the story starter
        app.get('/starters/:slug/edit', (req, res) => {
            console.log("edit form")
            var currentUser = req.user;
            Starter.findOne( {slug: req.params.slug})
            .then(starter => {
                console.log(starter.slug)
          // Starter.findById(req.params.id, function(err, starter) {
            res.render('starters-edit', { starter, currentUser });
        })
        });
      // });


        // UPDATE
        app.put('/starters/:slug', (req, res) => {
            console.log("googly "+ req.params.slug)
        var currentUser = req.user;
        if (req.body.content == ""){
            Starter.findById(req.params.id).then(starter => {
            res.render('errorEditStarter', {currentUser, starter}); //NEED TO MAKE AN ERROR PAGE FOR BOTH STARTERS AND THREADS FOR CORRECT REDIRECT
        });
        } else {
            Starter.findOne( {slug: req.params.slug})
            .then(starter => {
                console.log("POOOgly "+ starter.slug)
                starter.content = req.body.content
          // Starter.findByIdAndUpdate(req.params.id, req.body).then(starter => {
              starter.authorName = req.user.username
              starter.author = req.user._id;
              starter.save()
              res.redirect(`/starters/${starter.slug}`);
            })
            .catch(err => {
              console.log(err.message)
            })
        };
    });

    // Finished
    app.put('/starters/:slug/finished', (req, res) => {
        // console.log("googly "+ req.params.slug)
    var currentUser = req.user;
        Starter.findOne( {slug: req.params.slug})
        .then(starter => {
            starter.finished = true
      // Starter.findByIdAndUpdate(req.params.id, req.body).then(starter => {
          starter.save()
          res.redirect(`/starters/${starter.slug}/yarn`);
          // res.redirect(`/starters/${starter.slug}`);
        })
        .catch(err => {
          console.log(err.message)
        })
});


        // DELETE one compliment from the delete button on the "shown" compliment page
        app.delete('/starters/:slug', function (req, res) {
          var currentUser = req.user;
          console.log("starter id: "+req.params.id)
          Starter.findOneAndRemove({slug: req.params.slug}).then(starter => {
          // Starter.findByIdAndRemove(req.params.id).then(starter => {
             res.redirect('/');
          }).catch((err) => {
            console.log(err.message);
          })
      });

      app.get('/index/:letter', (req, res) => {
          // let landing = false;
          let startersFalse;
          let startersTrue;
          var currentUser = req.user;
          Starter.find({'index': req.params.letter, "finished": false}).populate('author')
            .then(startersFalse => {
            Starter.find({'index': req.params.letter, "finished": true}).populate('author')
                .then(startersTrue => {
                  res.render('index-landing', {startersTrue: startersTrue, startersFalse: startersFalse, currentUser});
              }).catch(err => {
                  console.log(err.message);
              })
          })
      });

};
