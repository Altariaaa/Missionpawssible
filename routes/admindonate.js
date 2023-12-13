const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express(); 



router.get('/admindonate', (req, res) => {
  res.render('admindonate'); // Render the 'admindonate' view for creating a new profile
});

router.post('/add-donation', async (req, res) => {
  try {
    const { name, amount, reference, payment } = req.body;
    console.log(req.body); // Log the entire request body to check the received data

    // Save the donation data to the database using Prisma
    const newDonation = await prisma.donation.create({
      data: {
        name,
        amount: parseFloat(amount),
        reference: parseInt(reference),
        payment,
        date: new Date().toISOString(), 
      },
    });

    res.redirect('/admin/admindashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to add donation' });
  }
});



module.exports = router;
