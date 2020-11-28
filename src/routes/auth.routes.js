const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../../connection');
const passport = require('../../helpers/passport');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


// création d'un nouvel utilisateur
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

// connexion d'un utilisateur
router.post('/login', (req, res) => {
    passport.authenticate('user', (err, user, info) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ token, message: info.message });
    })(req, res);
});



// renvoi d'un mot de passe
router.put('/reset-mdp', (req, res) => {
    const newMdp = Math.random().toString(20).substr(2, 10);
    const password = bcrypt.hashSync(newMdp, 10);
    const email = req.body.email;
    console.log(email);

    connection.query(`UPDATE users SET password = ? WHERE email = ?`, [password, email], (err) => {
        if (err) {
            res.status(500).send({ flash: err.message });
        } else {
            console.log(newMdp);
            const mail = {
                from: 'Lemonocle.net',
                to: email,
                subject: "Votre mot de passe a été mis à jour",
                text: `Suite à votre demande sur lemonocle.net, votre mot de passe a été mis à jour. Votre nouveau mot de passe est : ${newMdp} . `
            }
            transporter.sendMail(mail, (err, data) => {
                if (err) {
                    res.json({
                        status: err.message
                    })
                } else {
                    res.status(201).send({ message: 'Un nouveau mot de passe a été envoyé sur votre adresse mail !' });
                }
            }
            );
        }
    });
});

// connexion de l'administrateur
router.post('/admin-login', (req, res) => {
    passport.authenticate('admin', (err, user, info) => {
        if (err) {
            return res.status(500).send(err);
        }
        else if (!user) {
            return res.status(400).json({ message: info.message });
        }
        const token = jwt.sign(user, process.env.JWT_SECRET2, { expiresIn: "1d" });
        return res.status(200).json({ token, message: info.message });
    })(req, res);
});

router.get('/valide_token', passport.authenticate('jwt-admin', { session: false }), (req, res) => {
    res.sendStatus(200);
  });

module.exports = router;