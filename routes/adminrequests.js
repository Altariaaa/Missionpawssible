const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/adminrequests', async (req, res) => {
  try {
    // Fetch non-archived adoption records from the database
    const adoptions = await prisma.adoption.findMany({
      where: {
        archived: false,
       
      },
    });

    // Render the "adminrequests" view with the non-archived adoption data
    res.render('adminrequests', { adoptions });
  } catch (error) {
    console.error('Error fetching adoptions:', error);
    res.status(500).send('Error fetching adoptions');
  }
});

module.exports = router;
