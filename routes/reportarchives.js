const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/reportarchives', async (req, res) => {
    try {
        // Fetch archived reports records from the database
        const archivedReports = await prisma.report.findMany({
            where: { archived: true },
        });

        // Render the "reportarchives" view with the archived report data
        res.render('reportarchives', { archivedReports });
    } catch (error) {
        console.error('Error fetching archived reports:', error);
        res.status(500).send('Error fetching archived reports');
    }
});

router.post('/archive', async (req, res) => {
    const id = req.body.id; // Assuming that your report record has an 'id' field

    try {
        // Update the adoption request record with the specific 'id' to mark it as archived
        await prisma.report.update({
            where: { id: id },
            data: { archived: true },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error archiving report:', error);
        res.status(500).send('Error archiving report');
    }
});



// This route handles unarchiving
router.post('/unarchive', async (req, res) => {
    const id = req.body.id; // Assuming that your Adoption model has an 'id' field

    try {
        // Update the adoption request record to mark it as unarchived
        await prisma.report.update({
            where: { id: id },
            data: { archived: false },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error unarchiving report:', error);
        res.status(500).send('Error unarchiving report');
    }
});

// Add this route to handle deletion of archived requests
router.post('/delete', async (req, res) => {
    const id = req.body.id; // Assuming that your Adoption model has an 'id' field

    try {
        // Delete the archived adoption request record with the specific 'id'
        await prisma.report.delete({
            where: { id: id },
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting archived report:', error);
        res.status(500).send('Error deleting archived report');
    }
});

module.exports = router;
