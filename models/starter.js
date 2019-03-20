// models/starter.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

var uniqueValidator = require('mongoose-unique-validator');

var slugify = require('slugify');

const StarterSchema = new Schema({

  title: { type: String, required: false, unique: true },
  content: { type: String, required: false },
  threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  author : { type: Schema.Types.ObjectId, ref: "User", required: false },
  authorName: { type: String, required: false },

  slug: {type: String, required:false, unique: true},

  url: { type: String, required: false },
  index: {type: String, required: false},
  finished: {type: Boolean, required: false}
});

// StarterSchema.plugin(uniqueValidator);
StarterSchema.plugin(uniqueValidator, { message: 'Error, the title must be unique. Someone else already has a story with that title.' });


// Always populate the author field
StarterSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Starter", StarterSchema);
