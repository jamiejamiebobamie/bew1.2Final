// models/starter.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

var uniqueValidator = require('mongoose-unique-validator');

const StarterSchema = new Schema({

  title: { type: String, required: false, unique: true },
  content: { type: String, required: false },
  threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  author : { type: Schema.Types.ObjectId, ref: "User", required: false },
  authorName: { type: String, required: false },

  name: { type: String, required: false },
  url: { type: String, required: false },
  age: {type: String, required: false},
  origin: { type: String, required: false },
  occupation: {type: String, required: false },
  picture: {type: String, required: false} //To be implemented later... 'TBIL'
});

// StarterSchema.plugin(uniqueValidator);
StarterSchema.plugin(uniqueValidator, { message: 'Error, the title must be unique. Someone else already has a story with that title.' });

// Always populate the author field
StarterSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Starter", StarterSchema);
