const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/adminadoptions', async (req, res) => {
  try {
    // Fetch non-archived pet requests from the database
    const petRequests = await prisma.petRequest.findMany({
      where: { archived: false }, 
    });

    // Render the "adminadoptions" view with the non-archived pet request data
    res.render('adminadoptions', { petRequests });
  } catch (error) {
    console.error('Error fetching pet requests:', error);
    res.status(500).send('Error fetching pet requests');
  }
});

module.exports = router;
