const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express(); 


router.get('/petdetails/:id', async (req, res) => {
  const { id } = req.params; // Get the pet ID from the query parameter
  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      res.status(404).render('error', { message: 'Pet not found' });
    } else {
      const breed = pet.breed; // Get the breed of the current pet

      const breedPetsCount = await prisma.pet.count({
        where: {
          breed, // Count pets of the same breed
        },
      });

      // Fetch a random set of pets of the same breed excluding the current pet by ID
      const randomBreedPets = await prisma.pet.findMany({
        where: {
          breed,
          NOT: {
            id: pet.id,
          },
        },
        take: 4, // Fetch 4 random pets within the same breed
        skip: breedPetsCount > 4 ? Math.floor(Math.random() * (breedPetsCount - 4)) : 0, // Adjust skip value
      });

      res.render('petdetails', {
        title: 'Pet Details',
        pet,
        similarPetsByBreed: randomBreedPets, // Pass the randomly fetched pets of the same breed to the template
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error' });
  }
});



router.post('/submit-adoption', upload.fields([
  { name: 'validId', maxCount: 1 },
  { name: 'petStayingPhoto', maxCount: 1 },
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

    const validIdImage = req.files['validId'][0];
    const petStayingPhotoImage = req.files['petStayingPhoto'][0];

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

      },
    });

    res.redirect('/submit-adoption');
  } catch (error) {
    console.error('Error creating adoption record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
