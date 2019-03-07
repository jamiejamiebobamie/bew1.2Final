//threads.js route
//'threads' for simplicity instead of 'stories'

const Starter = require('../models/starter');
const Thread = require('../models/thread');


module.exports = function(app) {

        // CREATE thread
        app.post("/starters/:starterId/threads", function (req, res) {
            var currentUser = req.user;
            // const first_thread = req.params.starterId;
            // console.log("starter_id: " + first_thread)
            const thread = new Thread(req.body);
            thread.author = req.user._id;

            thread
                .save()
                .then(thread => {
                    return Promise.all([
                        Starter.findById(req.params.starterId)
                    ]);
                })
                .then(([starter, user]) => {
                    thread.starter = starter
                    // console.log("this is the starter id " + thread.starter._id)
                    thread.save()
                    // starter.threads.unshift(thread);
                    // thread.starter_author = user;
                    // console.log("this is the guy " + thread.starter_author)
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

        // SHOW
        // app.get("/starters/:id/thread/:id/edit", function (req, res) {
        //     var currentUser = req.user;
        //     Starter.findById(req.params.id).populate('threads').lean()
        //         .then(starter => {
        //             res.render("starters-show", { starter, currentUser });
        //         })
        //         .catch(err => {
        //             console.log(err.message);
        //         });
        // });

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
            console.log("this is the url" + save)
            // const starterId = save.substring(19,43)
            // const threadId = save.substring(53,)
            console.log("this is the starterId " + starterId)
            console.log("this is the threadId " + threadId)

            console.log("edit form: " + req.params)
            var currentUser = req.user;
        // Starter.findById(req.params.id).then(starter => {
          Thread.findById(threadId, function(err, thread) {
              // console.log("this is the thread: " + thread)
            res.render('threads-edit', {thread: thread});
          })
      });
  // });


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
      console.log("this is the url" + save)
      // const starterId = save.substring(19,43)
      // const threadId = save.substring(53,)
      console.log("this is the starterId " + starterId)
      console.log("this is the threadId " + threadId)
  var currentUser = req.user;
    Thread.findByIdAndUpdate(threadId, req.body).then(thread => {
        res.redirect(`/starters/${starterId}`);
      })
      .catch(err => {
        console.log(err.message)
      })
  });
        //
        // // UPDATE... does this replace EDIT? ...guess not...
        // app.put('/starters/starters/:starterId/threads/:threadId', (req, res) => {
        //     const save = req.originalUrl
        //     let count = 0;
        //     let starterId = "";
        //     let threadId = "";
        //     for(i=0; i< save.length; i++){
        //         if (save[i] == "/" || save[i] == "?"){
        //             count+=1}
        //         else if (count == 3 && save[i] != "/" && save[i] != "?"){
        //             starterId += save[i]
        //         }
        //         else if (count == 5 && save[i] != "/" && save[i] != "?"){
        //             threadId += save[i]
        //         }
        //     }
        // var currentUser = req.user;
        // Thread.findById(threadId).then(thread => {
        // //
        // //     console.log("stuff " + thread + threadId)
        // //     return Promise.all([
        // //         thread.content = req.body,
        // //         thread.save()
        // //
        // //     ]);
        //     // console.log(thread, req.body, thread.content)
        //
        //     // thread.save();
        //     // console.log("stuff " + thread + req.body + thread.content)
        // // Thread.findOneAndUpdate(threadId, req.body.content).then(thread => {
        //     console.log("url=" + save + " threadId's " + threadId + " " + thread._id + " " + thread + " " + req.body)
        //      res.redirect(`/starters/${starterId}`);
        //    })
        //  // Thread.findByIdAndUpdate(threadId, req.body).then(thread => {
        //  //     console.log(threadId, req.body, thread.content, thread)
        //  //         return Promise.all([
        //  //             thread.content = req.body,
        //  //             thread.save()
        //  //
        //  //         ]);
        //  //
        //  //      res.redirect(`/starters/${starterId}`);
        //  //    })
        //     .catch(err => {
        //       console.log(err.message)
        //     })
        // });


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
          console.log("thread id for delete: "+threadId)
          console.log("thread id for delete: "+save)

          Thread.findByIdAndRemove(threadId).then(thread => {
             res.redirect(`/starters/${starterId}`);
          }).catch((err) => {
            console.log(err.message);
          })
      });

// };

    };
