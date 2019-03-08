const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// var mySchema = mongoose.Schema(/* put your schema definition here */);

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  password: { type: String, select: false },
  username: { type: String, required: true, unique: true },
  starters : [{ type: Schema.Types.ObjectId, ref: "Starter" }],
  threads : [{ type: Schema.Types.ObjectId, ref: "Thread" }]
});

// Must use function here! ES6 => functions do not bind this!
UserSchema.pre("save", function(next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  // ENCRYPT PASSWORD
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

// Need to use function to enable this.password to work.
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
