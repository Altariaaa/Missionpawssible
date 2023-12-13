var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

// Configure the email transporter
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pawsiblemission@gmail.com',
    pass: 'zdhk ekuz jqtq rltg',
  },
});

// Function to send an email
var sendEmail = async function (to, subject, html) {
  return new Promise((resolve, reject) => {
    var mailOptions = {
      from: 'pawsiblemission@gmail.com',
      to: to,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Email sending error:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info.response);
      }
    });
  });
};



// PET ADOPTION REQUEST
// POST route for sending emails
router.post('/send-email-request', async function(req, res, next) {
  try {
    var email = req.body.email;
    var status = req.body.status;
    var subject = 'Your Pet Request Application Has Been ' + status;
    var htmlTemplate = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          background-color: #f4f4f4;
          padding: 20px;
          border-radius: 8px;
        }
        h2 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${status === "Accepted"
          ? `
          <h2>Congratulations! Your Pet Application Has Been Accepted 🐾</h2>
          <p>Dear Adopter,</p>
          <p>We are thrilled to inform you that your recent application for Pet Request on Mission PAWSsible has been accepted! 🎉</p>
          <p>Your dedication to providing care and support for our furry friends aligns perfectly with our mission, and we appreciate your commitment to making a positive impact on the lives of animals.</p>
          <p>To proceed with the next steps, we kindly ask you to reach out to us through our Facebook page to confirm your application and schedule a visit to the shelter. Our team is eager to assist you and ensure a smooth and delightful experience during your visit.</p>
          <p><strong>👉 <a href="https://www.facebook.com/missionpawssibleph" target="_blank">https://www.facebook.com/missionpawssibleph</a></strong></p>
          <p>Please feel free to ask any questions or discuss specific details related to your application during this communication. We are here to support you in every step of the way.</p>
          <p>Thank you once again for choosing Mission PAWSsible. We look forward to welcoming you and making a difference in the lives of our beloved pets.</p>
          <p><strong>Best Regards,</strong></p>
          <p><em>Mission PAWSsible 🐾</em></p>
          `
          : `
          <h2>We're Sorry, Your Pet Application Has Been Rejected 😢</h2>
          <p>Dear Adopter,</p>
          <p>We regret to inform you that your recent application for Pet Request on Mission PAWSsible has been rejected. Unfortunately, we are unable to proceed with your application at this time.</p>
          <p>If you have any questions or would like more information about the rejection, please feel free to contact us through our Facebook page: <strong><a href="https://www.facebook.com/missionpawssibleph" target="_blank">https://www.facebook.com/missionpawssibleph</a></strong></p>
          <p>We appreciate your understanding and thank you for considering Mission PAWSsible for your Pet Request journey.</p>
          <p><strong>Best Regards,</strong></p>
          <p><em>Mission PAWSsible 🐾</em></p>
          `
        }
      </div>
    </body>
    </html>
    `;
    // Send the email
    await sendEmail(email, subject, htmlTemplate);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
