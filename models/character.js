// models/character.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const CharacterSchema = new Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
  summary: { type: String, required: true },
  age: {type: String, required: false},
  origin: { type: String, required: false },
  occupation: {type: String, required: false },
  //'storys' for simplicity instead of 'stories'
  storys: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
  picture: {type: String, required: false}, //To be implemented later... 'TBIL'
});

// Always populate the author field
CharacterSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Character", CharacterSchema);
