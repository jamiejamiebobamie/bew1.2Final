const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const ThreadSchema = new Schema({
  content: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: false },
  starter: { type: Schema.Types.ObjectId, ref: "Starter", required: false },
  starter_author: { type: Schema.Types.ObjectId, ref: "User", required: false },
  authorName: { type: String, required: false },
  slug: {type: String, required: false}
});

// Always populate the author field
ThreadSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Thread", ThreadSchema);
