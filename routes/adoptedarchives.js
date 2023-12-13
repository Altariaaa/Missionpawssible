const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/adoptedarchives', async (req, res) => {
    try {
        // Fetch adopted pet  from the database
        const adoptedPets = await prisma.pet.findMany({
            where: { adopted: true },
        });

        // Render the "adoptedarchives" view with the adopted data
        res.render('adoptedarchives', { adoptedPets });
    } catch (error) {
        console.error('Error fetching adopted pets:', error);
        res.status(500).send('Error fetching adopted pets');
    }
});

router.post('/archive', async (req, res) => {
    const id = req.body.id; 

    try {
        // Update the pet record with the specific 'id' to mark it as adopted
        await prisma.pet.update({
            where: { id: id },
            data: { adopted: true },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error archiving adopted pet:', error);
        res.status(500).send('Error archiving adopted pet');
    }
});



// This route handles unarchiving
router.post('/unarchive', async (req, res) => {
    const id = req.body.id; // Assuming that your Adoption model has an 'id' field

    try {
        // Update the adoption request record to mark it as unadopted
        await prisma.pet.update({
            where: { id: id },
            data: { adopted: false },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error unarchiving adoption request:', error);
        res.status(500).send('Error unarchiving adoption request');
    }
});


module.exports = router;
