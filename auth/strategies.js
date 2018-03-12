

const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const {User} = require('../users/models');
const localStrategy = new LocalStrategy((username, password, done) => {
  let user;

  User
    .findOne({username})
    .then((results) => {
      user = results;

      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username',
        });
      }

      return user.validatePassword(password);
    })
    .then((isValid) => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password',
        });
      }
      return done(null, user);
    })
    .catch((err) => {
      if (err.reason === 'LoginError') {
        return done(null, false);
      }

      return done(err);
    });
});

const {JWT_SECRET} =require('../config');

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256'],
  }, (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = {jwtStrategy, localStrategy};

