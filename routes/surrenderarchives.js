const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/surrenderarchives', async (req, res) => {
    try {
        // Fetch archived surrender records from the database
        const archivedSurrenders = await prisma.surrender.findMany({
            where: { archived: true },
        });

        // Render the "requestarchives" view with the archived adoption data
        res.render('surrenderarchives', { archivedSurrenders });
    } catch (error) {
        console.error('Error fetching archived adoptions:', error);
        res.status(500).send('Error fetching archived adoptions');
    }
});

router.post('/archive', async (req, res) => {
    const id = req.body.id; // Assuming that your surrender record has an 'id' field

    try {
        // Update the adoption request record with the specific 'id' to mark it as archived
        await prisma.surrender.update({
            where: { id: id },
            data: { archived: true },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error archiving adoption request:', error);
        res.status(500).send('Error archiving adoption request');
    }
});



// This route handles unarchiving
router.post('/unarchive', async (req, res) => {
    const id = req.body.id; // Assuming that your Adoption model has an 'id' field

    try {
        // Update the adoption request record to mark it as unarchived
        await prisma.surrender.update({
            where: { id: id },
            data: { archived: false },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error unarchiving adoption request:', error);
        res.status(500).send('Error unarchiving adoption request');
    }
});

// Add this route to handle deletion of archived requests
router.post('/delete', async (req, res) => {
    const id = req.body.id; // Assuming that your Adoption model has an 'id' field

    try {
        // Delete the archived adoption request record with the specific 'id'
        await prisma.surrender.delete({
            where: { id: id },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting archived adoption request:', error);
        res.status(500).send('Error deleting archived adoption request');
    }
});

module.exports = router;
