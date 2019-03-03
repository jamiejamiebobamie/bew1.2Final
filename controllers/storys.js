//storys.js route
//'storys' for simplicity instead of 'stories'

const Character = require('../models/character');
const Story = require('../models/story');


module.exports = function(app) {

        // CREATE story
        app.post("/characters/:characterId/storys", function (req, res) {
            const story = new Story(req.body);
            story.author = req.user._id;
            story
                .save()
                .then(story => {
                    return Promise.all([
                        Character.findById(req.params.characterId)
                    ]);
                })
                .then(([character, user]) => {
                    Character.storys.unshift(story);
                    return Promise.all([
                        character.save()
                    ]);
                })
                .then(character => {
                    res.redirect(`/characters/${req.params.characterId}`);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    };
