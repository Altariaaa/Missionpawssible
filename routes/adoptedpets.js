const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/adoptedpets', async (req, res) => {
    try {
      const adopts = await prisma.adopt.findMany(); // Fetch all adopted pets
  
      // Render the 'adoptedpets.ejs' view and pass the adoptedPets data to it
      res.render('adoptedpets', { adopts });
    } catch (error) {
      console.error('Error fetching adopted pets:', error);
      res.status(500).send('Error fetching adopted pets');
    }
  });

  // Handle POST request to delete
router.post('/adoptedpets/delete/:id', async (req, res) => {
    try {
      const adoptId = req.params.id;
  
      // Delete from the database
      await prisma.adopt.delete({
        where: { id: adoptId },
      });
  
      // Respond with a JSON success message
      res.json({ success: true, message: 'information deleted successfully' });
    } catch (error) {
      console.error('Error deleting informatiobn:', error);
  
      // Respond with a JSON error message
      res.status(500).json({ success: false, message: 'Error deleting info' });
    }
  });
module.exports = router;
