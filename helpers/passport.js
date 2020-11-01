const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const connection = require('../connection');
require('dotenv').config();

passport.use(new LocalStrategy(
  {
    loginField: 'login',
    passwordField: 'password',
    session: false,
  },
  ((login, password, cb) => {
    connection.query('SELECT * FROM users WHERE login = ? ', login, (err, results) => {
      if (err) {
        return cb(err);
      } if (results.length === 0) {
        return cb(null, false, {
          message: 'identifiant ou mot de passe incorrect',
        });
      }
      if (bcrypt.compareSync(password, results[0].password)) {
        const id = results[0].id;
        const user = {id};
        return cb(null, user,  { message: 'Vous êtes bien connecté' });
      }
      return cb(null, false, {
        message: 'identifiant ou mot de passe incorrect',
      });
    });
  }),
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
},

  ((jwtPayload, cb) => cb(null, jwtPayload))));

module.exports = passport;
