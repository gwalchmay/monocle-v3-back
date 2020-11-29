const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const passport = require('../../helpers/passport');
const { connection } = require('../../connection');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Serveur pret a gerer les messages.");
    }
});


// envoi d'un email par le formulaire de contact
router.post('/', (req, res, next) => {
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    const content = `email: ${email} \n sujet: ${subject} \n message: ${message} `
    const mail = {
        from: email,
        to: process.env.EMAIL,
        subject: "Une demande utilisateur a été effectuée",
        text: content
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })
        }
    })
})


// récupération d'un email client pour préremplir le formulaire de contact
router.get('/email', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user.id;
    connection.query(`SELECT email FROM users WHERE id = ${user}`, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results[0].email);
        }
    });
});



module.exports = router;