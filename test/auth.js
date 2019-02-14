const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const agent = chai.request.agent(app);
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);

const User = require("../models/user");

const newPost = {
...
}

const user = {
    username: 'poststest',
    password: 'testposts'
};

before(function (done) {
  agent
    .post('/sign-up')
    .set("content-type", "application/x-www-form-urlencoded")
    .send(user)
    .then(function (res) {
      done();
    })
    .catch(function (err) {
      done(err);
    });
});

describe("User", function() {
    it("should not be able to login if they have not registered", function(done) {
    agent.post("/login", { email: "wrong@wrong.com", password: "nope" }).end(function(err, res) {
      res.status.should.be.equal(401);
      done();
    });
  });

  it("should be able to signup", function(done) {
  User.findOneAndRemove({ username: "testone" }, function() {
    agent
      .post("/sign-up")
      .send({ username: "testone", password: "password" })
      .end(function(err, res) {
        console.log(res.body);
        res.should.have.status(200);
        agent.should.have.cookie("nToken");
        done();
      });
  });
});

after(function (done) {
  Post.findOneAndDelete(newPost)
  .then(function (res) {
      agent.close()

      User.findOneAndDelete({
          username: user.username
      })
        .then(function (res) {
            done()
        })
        .catch(function (err) {
            done(err);
        });
  })
  .catch(function (err) {
      done(err);
  });
});

// login
it("should be able to login", function(done) {
  agent
    .post("/login")
    .send({ username: "testone", password: "password" })
    .end(function(err, res) {
      res.should.have.status(200);
      agent.should.have.cookie("nToken");
      done();
    });
});

// logout
it("should be able to logout", function(done) {
  agent.get("/logout").end(function(err, res) {
    res.should.have.status(200);
    agent.should.not.have.cookie("nToken");
    done();
  });
});
});
