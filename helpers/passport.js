const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const connection = require('../connection');
const crypto = require('crypto');

require('dotenv').config();

passport.use('user', new LocalStrategy(
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
          message: 'Identifiant ou mot de passe incorrect.',
        });
      }
      if (bcrypt.compareSync(password, results[0].password)) {
        const id = results[0].id;
        const user = { id };
        return cb(null, user, { message: 'Vous êtes bien connecté.' });
      }
      return cb(null, false, {
        message: 'Identifiant ou mot de passe incorrect.',
      });
    });
  }),
));

passport.use('admin', new LocalStrategy(
  {
    loginField: 'login',
    passwordField: 'password',
    session: false,
  },
  ((login, password, cb) => {
    connection.query('SELECT * FROM admin_users WHERE login = ? ', login, (err, results) => {
      function encryptPassword(password) {
        var digest = crypto.createHash('sha512').update(password).digest('binary');
        for (var i = 1; i < 5000; i++) {
          digest = crypto.createHash('sha512').update(Buffer.concat([Buffer.from(digest, 'binary'), Buffer.from(password, 'utf8')])).digest('binary');
        }
        return (Buffer.from(digest, 'binary')).toString('base64');
      };
      if (err) {
        return cb(err);
      } else if (results.length === 0) {
        return cb(null, false, {
          message: 'Identifiant ou mot de passe incorrect.',
        });
      }
      else if (encryptPassword(password) === results[0].password) {
        const id = results[0].id;
        const user = { id };
        return cb(null, user, { message: 'Vous êtes bien connecté.' });
      }
      return cb(null, false, {
        message: 'Identifiant ou mot de passe incorrect.',
      });
    });
  }),
));

// authentification d'un utilisateur
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
},

  ((jwtPayload, cb) => cb(null, jwtPayload))));


// authentification de l'administrateur
passport.use('jwt-admin', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET2,
},

  ((jwtPayload, cb) => cb(null, jwtPayload))));

module.exports = passport;
