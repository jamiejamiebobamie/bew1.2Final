//threads.js route
//'threads' for simplicity instead of 'stories'

const Starter = require('../models/starter');
const Thread = require('../models/thread');


module.exports = function(app) {

        // CREATE thread
        app.post("/starters/:starterId/threads", function (req, res) {
            var currentUser = req.user;
            const thread = new Thread(req.body);
            thread.author = req.user._id;
            thread.authorName = req.user.username
            thread
                .save()
                .then(thread => {
                    return Promise.all([
                        Starter.findById(req.params.starterId)
                    ]);
                })
                .then(([starter, user]) => {
                    thread.starter = starter
                    thread.save()
                    starter.threads.push(thread);
                    return Promise.all([
                        starter.save()
                    ]);
                })
                .then(starter => {
                    res.redirect(`/starters/${req.params.starterId}`);
                })
                .catch(err => {
                    console.log(err);
                });
        });

        // EDIT a compliment by clicking on the edit link in the shown compliment
        app.get('/starters/:starterId/threads/:threadId/edit', (req, res) => {
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
          Thread.findById(threadId, function(err, thread) {
            res.render('threads-edit', {thread, currentUser});
          })
      });



  // UPDATE... does this replace EDIT? ...guess not...
  app.put('/starters/:starterId/threads/:threadId', (req, res) => {
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
        res.redirect(`/starters/${starterId}`);
      })
      .catch(err => {
        console.log(err.message)
      })
  };
});

        // DELETE one compliment from the delete button on the "shown" compliment page
        app.delete('/starters/:starterId/threads/:threadId', function (req, res) {
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
             res.redirect(`/starters/${starterId}`);
          }).catch((err) => {
            console.log(err.message);
          })
      });
    };
