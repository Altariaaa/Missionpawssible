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

// PET REPORT
// POST route for sending emails
router.post('/send-email-report', async function(req, res, next) {
  try {
    var email = req.body.email;
    var status = req.body.status; // 'Accepted' or 'Declined'
    var subject = status === "Accepted" 
                    ? 'Your Report Has Been Received - Thank You for Your Compassion 🐾' 
                    : 'Your Report Review - We Appreciate Your Effort 🐾';
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
          <h2>Pet Shelter</h2>
          <p>Dear Informant,</p>
          <p>Thank you for taking the time to submit a report through Mission PAWSsible. Your commitment to the welfare of animals is truly appreciated, and your report plays a vital role in ensuring the safety and well-being of our furry friends.</p>
          <p>Our team has received your report, and we will thoroughly investigate the matter to address any concerns or issues raised. Your contribution to maintaining a safe and caring environment for our animals is invaluable.</p>
          <p>If necessary, we may reach out to you for additional information or clarification during the investigation process. We are committed to transparency and keeping you informed about the progress made in resolving the reported situation.</p>
          <p>Once again, thank you for your compassion and dedication to making a positive impact on the lives of animals in need. If you have any further questions or if there's anything else you'd like to share, please feel free to contact us.</p>
          <p>Best Regards,</p>
          <p><em>Mission PAWSsible Team 🐾</em></p>
          `
          : `
          <h2>Pet Shelter</h2>
          <p>Dear Informant,</p>
          <p>We appreciate the time and effort you took to submit a report to Mission PAWSsible. After careful review, we have decided not to proceed with the report at this time.</p>
          <p>This decision does not diminish the value of your concern. We encourage you to keep a watchful eye and report any future situations that you believe warrant our attention.</p>
          <p>If you have questions or require further assistance, please do not hesitate to contact us. Your involvement in animal welfare is important, and we are here to support your efforts.</p>
          <p>Thank you for your understanding and for your commitment to the well-being of animals.</p>
          <p>Best Regards,</p>
          <p><em>Mission PAWSsible Team 🐾</em></p>
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