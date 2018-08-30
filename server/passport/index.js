const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(async function(username, password, done) {
    try {
      const user = await User.findOne({ username }).select("+password");

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      bcrypt.compare(password, user.password, function(err, match) {
        if (err) {
          return done(err);
        }

        if (!match) {
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      });
    } catch (error) {
      return done(error);
    }
  }),
);

module.exports = passport;
