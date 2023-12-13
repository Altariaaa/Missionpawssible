const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Handle POST request to save a contact
router.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Get the current date and time
    const currentDateTime = new Date();

    // Use Prisma client to create a new contact in the database
    const newContact = await prisma.contactFormEntry.create({
      data: {
        name,          // Use the 'name' from req.body
        email,         // Use the 'email' from req.body
        phone,         // Use the 'phone' from req.body
        message,       // Use the 'message' from req.body
        createdAt: currentDateTime, // Set the 'createdAt' field manually
      },
    });

    console.log('Contact created:', newContact);


    // Send a JSON response with a success message
    res.redirect('/submit-contact');
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Error saving contact' });
  }
});

router.get('/submit-contact', (req, res) => {
  res.render('submit-contact'); // Renders the submit-surrender.ejs template
});

module.exports = router;
