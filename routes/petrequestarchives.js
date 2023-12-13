const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/petrequestarchives', async (req, res) => {
    try {
        // Fetch archived adoption records from the database
        const archivedPetRequests = await prisma.petRequest.findMany({
            where: { archived: true },
        });

        // Render the "petrequestarchives" view with the archived adoption data
        res.render('petrequestarchives', { archivedPetRequests });
    } catch (error) {
        console.error('Error fetching archived request:', error);
        res.status(500).send('Error fetching archived request');
    }
});

router.post('/archive', async (req, res) => {
    const id = req.body.id; // Assuming that your adoption record has an 'id' field

    try {
        // Update the adoption request record with the specific 'id' to mark it as archived
        await prisma.petRequest.update({
            where: { id: id },
            data: { archived: true },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error archiving request:', error);
        res.status(500).send('Error archiving request');
    }
});



// This route handles unarchiving
router.post('/unarchive', async (req, res) => {
    const id = req.body.id; // Assuming that your Adoption model has an 'id' field

    try {
        // Update the adoption request record to mark it as unarchived
        await prisma.petRequest.update({
            where: { id: id },
            data: { archived: false },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error unarchiving request:', error);
        res.status(500).send('Error unarchiving request');
    }
});

// Add this route to handle deletion of archived requests
router.post('/delete', async (req, res) => {
    const id = req.body.id; // Assuming that your Adoption model has an 'id' field

    try {
        // Delete the archived adoption request record with the specific 'id'
        await prisma.petRequest.delete({
            where: { id: id },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting archived request:', error);
        res.status(500).send('Error deleting archived request');
    }
});

module.exports = router;
