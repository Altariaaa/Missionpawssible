const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const prisma = new PrismaClient();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where the uploaded image will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique file name
  }
});

const upload = multer({ storage: storage });
router.post('/submit-surrender', upload.single('image'), async (req, res) => {
  try {
    const { email, date, ownerName, contact, fullAddress, petType, petName, dateOfBirth, breed, color, sex } = req.body;
    const imagePath = req.file ? req.file.path : null; // Get the path to the uploaded image

    const newSurrender = await prisma.surrender.create({
      data: {
        email,
        date,
        ownerName,
        contact,
        fullAddress,
        petType,
        petName,
        dateOfBirth,
        breed,
        color,
        validId,
        image: imagePath, // Use the image path from the form data
        sex,
      }
    });


    res.status(201).json({ message: 'Surrender report submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle GET request to display submitted surrenders
router.get('/adminsurrender', async (req, res) => {
  try {
    // Fetch all surrenders from the database (adjust this query as needed)
    const surrenders = await prisma.surrender.findMany({
      where: { archived: false },
    });

    // Render the "adminsurrender.ejs" template with the surrenders data
    res.render('adminsurrender', { surrenders });
  } catch (error) {
    console.error('Error fetching surrenders:', error);
    res.status(500).send('Error fetching surrenders');
  }
});

module.exports = router;
