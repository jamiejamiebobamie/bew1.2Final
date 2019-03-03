const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const StorySchema = new Schema({
  content: { type: String, required: false },
  author : { type: Schema.Types.ObjectId, ref: "User", required: false },
  character: { type: Schema.Types.ObjectId, ref: "Character", required: false }
});

// Always populate the author field
StorySchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Story", StorySchema);
