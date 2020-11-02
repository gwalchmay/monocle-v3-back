const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../../connection');
const passport = require('../../helpers/passport');
require('dotenv').config();

const router = express.Router();


router.post('/newuser', (req, res) => {
    const formData = {
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        roles: req.body.roles
    };
    connection.query('INSERT INTO users SET ?', formData, (err) => {
        if (err) {
            res.status(500).send({ flash: err.message });
        } else {
            res.status(201).send({ flash: 'Votre utilisateur est créé !' });
        }
    });
});

router.post('/login', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 3600 });
        return res.status(200).json({ token, message: info.message });
    })(req, res);
});

router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user);
    res.sendStatus(200);
});

router.get('/valide_token', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
