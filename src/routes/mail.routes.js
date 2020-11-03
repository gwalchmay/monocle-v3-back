const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
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

router.post('/', (req, res, next) => {
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    const content = `email: ${email} \n subject: ${subject} \n message: ${message} `
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

  module.exports = router;