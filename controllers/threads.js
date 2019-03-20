//threads.js route
//'threads' for simplicity instead of 'stories'

const Starter = require('../models/starter');
const Thread = require('../models/thread');


module.exports = function(app) {

        // CREATE thread
        app.post("/starters/:starterSlug/threads", function (req, res) {
            var currentUser = req.user;
            const thread = new Thread(req.body);
            thread.author = req.user._id;
            thread.authorName = req.user.username;
            thread.slug = req.params.starterSlug;
            thread
                .save()
                .then(thread => {
                    return Promise.all([
                        Starter.findOne({slug: req.params.starterSlug})
                        // Starter.findById(req.params.starterId)
                    ]);
                })
                .then(([starter, user]) => {
                    console.log("heya!!!" + starter.threads)
                    thread.starter = starter
                    thread.save()
                    starter.threads.push(thread);
                    return Promise.all([
                        starter.save()
                    ]);
                })
                .then(starter => {
                    res.redirect(`/starters/${req.params.starterSlug}`);
                })
                .catch(err => {
                    console.log(err);
                });
        });

        // EDIT a compliment by clicking on the edit link in the shown compliment
        app.get('/starters/:starterSlug/threads/:threadId/edit', (req, res) => {
            const save = req.originalUrl
            let count = 0;
            let starterId = "";
            let threadId = "";
            for(i=0; i< save.length; i++){
                if (save[i] == "/" || save[i] == "?"){
                    count+=1}
                else if (count == 2 && save[i] != "/" && save[i] != "?"){
                    starterId += save[i]
                }
                else if (count == 4 && save[i] != "/" && save[i] != "?"){
                    threadId += save[i]
                }
            }
            var currentUser = req.user;
            Starter.findOne({slug: req.params.starterSlug})
            .then(starter => {
                console.log('LOLOL' + starter.slug)
          Thread.findById(req.params.threadId, function(err, thread) {
            res.render('threads-edit', {starter, thread, currentUser});
          })
      })
      });



  // UPDATE... does this replace EDIT? ...guess not...
  app.put('/starters/:starterSlug/threads/:threadId', (req, res) => {
      const save = req.originalUrl
      let count = 0;
      let starterId = "";
      let threadId = "";
      for(i=0; i< save.length; i++){
          if (save[i] == "/" || save[i] == "?"){
              count+=1}
          else if (count == 2 && save[i] != "/" && save[i] != "?"){
              starterId += save[i]
          }
          else if (count == 4 && save[i] != "/" && save[i] != "?"){
              threadId += save[i]
          }
      }
  var currentUser = req.user;
  if (req.body.title == "" || req.body.content == ""){
      Starter.findById(starterId).then(starter => {
      res.render('errorEditStarter', {currentUser, starter}); //NEED TO MAKE AN ERROR PAGE FOR BOTH STARTERS AND THREADS FOR CORRECT REDIRECT
  });
  } else {
    Thread.findByIdAndUpdate(threadId, req.body).then(thread => {
        thread.authorName = req.user.username
        thread.author = req.user._id;
        thread.save()
        console.log(thread.author, thread.authorName)
        res.redirect(`/starters/${thread.slug}`);
      })
      .catch(err => {
        console.log(err.message)
      })
  };
});

        // DELETE one compliment from the delete button on the "shown" compliment page
        app.delete('/starters/:starterSlug/threads/:threadId', function (req, res) {
            console.log(req.params.starterSlug)
          var currentUser = req.user;
          const save = req.originalUrl
          let count = 0;
          let starterId = "";
          let threadId = "";
          for(i=0; i< save.length; i++){
              if (save[i] == "/" || save[i] == "?"){
                  count+=1}
              else if (count == 2 && save[i] != "/" && save[i] != "?"){
                  starterId += save[i]
              }
              else if (count == 4 && save[i] != "/" && save[i] != "?"){
                  threadId += save[i]
              }
          }
          Thread.findByIdAndRemove(threadId).then(thread => {
             res.redirect(`/starters/${thread.slug}`);
          }).catch((err) => {
            console.log(err.message);
          })
      });
    };
