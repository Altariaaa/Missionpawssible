const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express(); 


router.get('/adopt', async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { adopted: false },
    });

    // Shuffle the pets array randomly
    const shuffledPets = pets.sort(() => Math.random() - 0.5);

    res.render('adopt', { title: 'Adopt Pets', pets: shuffledPets });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error' });
  }
});


router.post('/submit-adoption', upload.fields([
  { name: 'validId', maxCount: 1 },
  { name: 'petStayingPhoto', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      email,
      fullName,
      petName,
      petType,
      existingPets,
      agreeToAdopt,
      promiseToCare,
      acceptTerms,
      address,
      contactNumber,
      facebookLink,
    } = req.body;
    
// Get the paths to the uploaded images
    const validIdImage = req.files['validId'][0];
    const petStayingPhotoImage = req.files['petStayingPhoto'][0];
    const selfie = req.files['selfie'][0];

    const agreeToAdoptChecked = agreeToAdopt === 'on';
    const promiseToCareChecked = promiseToCare === 'on';
    const acceptTermsChecked = acceptTerms === 'on';

    const adoption = await prisma.adoption.create({
      data: {
        email,
        fullName,
        petType,
        petName,
        existingPets,
        visitDate: new Date().toISOString(),
        agreeToAdopt: agreeToAdoptChecked,
        promiseToCare: promiseToCareChecked,
        acceptTerms: acceptTermsChecked,
        address,
        contactNumber,
        contractDate: new Date().toISOString(),
        facebookLink,
        validId: validIdImage ? validIdImage.path : null,
        petStayingPhoto: petStayingPhotoImage ? petStayingPhotoImage.path : null,
        selfie: selfie ? selfie.path : null,

      },
    });

    res.redirect('/submit-adoption');
  } catch (error) {
    console.error('Error creating adoption record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/submit-adoption', (req, res) => {
  res.render('submit-adoption'); // Renders the submit-adoption.ejs template
});


//pet request

router.post('/submit-request', upload.fields([
  { name: 'validId', maxCount: 1},
  { name: 'pictureWithId', maxCount: 1},
]), async (req, res) => {
  try {
    const {
      email,
      fullName,
      contactNumber,
      sex,
      color,
      agePreference,
      type,
      breed,
    } = req.body;

    // Assuming you're using multer for file uploads
    const validIdImage = req.files['validId'][0]; // Adjust accordingly
    const pictureWithIdImage = req.files['pictureWithId'][0]; // Adjust accordingly

    const petRequest = await prisma.petRequest.create({
      data: {
        email,
        fullName,
        contactNumber,
        date: new Date().toISOString(),
        type,
        breed,
        sex,
        color,
        agePreference,
        validId: validIdImage ? validIdImage.path : null,
        pictureWithId: pictureWithIdImage ? pictureWithIdImage.path : null,
      },
    });

    res.status(201).json(petRequest);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;