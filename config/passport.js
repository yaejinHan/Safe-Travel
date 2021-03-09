/*
for this file, I used the video - https://www.youtube.com/watch?v=6FOq4cUdH8k 
heavily as a reference
although the code looks mostly the same, I've watched the video several times to understand
what's going on, figure out what line of code is for what and to understand the whole flow of
this passport.js file working with users.js file with routes that start with /users
*/
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// load User model
const User = require('../models/User');


module.exports = function(passport) {
    passport.use(
        new LocalStrategy(
          { usernameField: 'email',
            passReqToCallback: true, 
          }, (req, email, password, done) => {
            User.findOne({email: email})
                .then(user => {
                    if (!user) {
                      // when it couldn't find any user by the email
                      // error flash message that says 'incorrect password or email' set from users.js
                        return done(null, false);

                    }

                    // there was a user by that email, so
                    // compare password with bcrypt
                    bcrypt.compare(password, user.password, (err, isAMatch) => {

                        if (err) throw err;

                        if (!isAMatch) {
                          // couldn't match password with the user's associated email
                          return done(null, false);
                        }

                        // hashed incoming password and user's hashed password matched,
                        // return user
                        return done(null, user);
                       
                });
            });
        })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
