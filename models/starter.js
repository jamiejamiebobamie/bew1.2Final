// models/starter.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const StarterSchema = new Schema({

  title: { type: String, required: false },
  content: { type: String, required: false },
  threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  author : { type: Schema.Types.ObjectId, ref: "User", required: false },

  name: { type: String, required: false },
  url: { type: String, required: false },
  age: {type: String, required: false},
  origin: { type: String, required: false },
  occupation: {type: String, required: false },
  picture: {type: String, required: false} //To be implemented later... 'TBIL'
});

// Always populate the author field
StarterSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Starter", StarterSchema);
