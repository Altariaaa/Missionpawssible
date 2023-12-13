const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer'); // Require Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

router.get('/surrender', (req, res) => {
  res.render('surrender'); // Render the 'surrender' view for creating a new surrender report
});


router.post('/submit-surrender', upload.fields([
  { name: 'validId', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
  { name: 'petpic', maxCount: 1 },
]), async (req, res) => {
  try {
    const { 
      email, 
      ownerName, 
      contact, 
      fullAddress, 
      petName, 
      color, 
      sex, 
      spayedNeutered, 
      vaccinated, 
      medicalConcerns, 
      currentMedicalIssues, 
      aggression, 
      biting, 
      leashCageTrained, 
      goodWithOtherPets, 
      goodWithChildren, 
      indoorOutdoor, 
      paymentMethod, 
    } = req.body;

    const validIdImage = req.files['validId'][0];
    const selfie = req.files['selfie'][0];
    const petpicImage = req.files['petpic'][0];

    const petType = req.body.petType; // Ensure that you're not modifying petType here
    const breed = Array.isArray(req.body.breed) ? req.body.breed.join(', ') : req.body.breed;
    // Convert the agreementAccepted checkbox value to a Boolean
    const agreementAccepted = req.body.agreementAccepted === 'on';

    // Create a new Surrender record
    const surrender = await prisma.surrender.create({
      data: {
        email,
        date: new Date().toISOString(), // Set the current date and time in ISO-8601 format
        ownerName,
        contact,
        fullAddress,
        petType,
        petName,
        dateOfBirth: new Date().toISOString(), // Set the current date and time in ISO-8601 format
        breed,  
        color,
        sex,
        spayedNeutered,
        vaccinated,
        medicalConcerns,
        currentMedicalIssues,
        aggression,
        biting,
        leashCageTrained,
        goodWithOtherPets,
        goodWithChildren,
        indoorOutdoor,
        paymentMethod,
        agreementAccepted,
        validId: validIdImage ? validIdImage.path : null, // Store the file path of the uploaded image
        selfie: selfie ? selfie.path : null,
        petpic: petpicImage ? petpicImage.path : null,
  
      },
    });

    res.redirect('/submit-surrender');
  } catch (error) {
    console.error('Error creating surrender record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route for displaying the submission message
router.get('/submit-surrender', (req, res) => {
  res.render('submit-surrender'); // Renders the submit-surrender.ejs template
});

module.exports = router;