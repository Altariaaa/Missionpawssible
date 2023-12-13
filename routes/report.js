const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer'); // Require Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

router.get('/report', (req, res) => {
  res.render('report'); 
});


// Handle POST request to save a report
router.post('/submit-report', upload.single('petImage'), async (req, res) => {
  try {
    const { completeLocation, landmark, status, email, phone, message} = req.body;
    const imagePath = req.file ? req.file.path : null;
// Get the current date and time
const currentDateTime = new Date();
    // Use Prisma client to create a new report in the database
    const newReport = await prisma.report.create({
      data: {
        completeLocation,
        landmark,
        status,
        email,
        phone,
        petImage: imagePath,
        message,
        createdAt: currentDateTime,
      },
    });

    console.log('Report created:', newReport);

    res.render('submit-report'); // Render a success page or redirect as needed
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).send('Error saving report');
  }
});

router.get('/submit-report', (req, res) => {
  res.render('submit-report'); // Render the submit-report.ejs template
});

module.exports = router;