//threads.js route
//'threads' for simplicity instead of 'stories'

const Starter = require('../models/starter');
const Thread = require('../models/thread');


module.exports = function(app) {

        // CREATE thread
        app.post("/starters/:starterId/threads", function (req, res) {
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
                    Starter.threads.unshift(thread);
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
    };
