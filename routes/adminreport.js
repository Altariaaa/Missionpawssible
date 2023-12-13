const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Handle GET request to display submitted reports
router.get('/adminreport', async (req, res) => {
  try {
    // Fetch all reports from the database (adjust this query as needed)
    const reports = await prisma.report.findMany({
      where: { archived: false },
    });

    // Render the "adminreport.ejs" template with the reports data
    res.render('adminreport', { reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).send('Error fetching reports');
  }
});

// Handle POST request to delete a report
router.post('/adminreport/delete/:id', async (req, res) => {
  try {
    const reportId = req.params.id;

    // Delete the report from the database
    await prisma.report.delete({
      where: { id: reportId },
    });

    // Respond with a JSON success message
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);

    // Respond with a JSON error message
    res.status(500).json({ success: false, message: 'Error deleting report' });
  }
});

// Handle POST request to update reportstatus
router.post('/adminreport/check/:id', async (req, res) => {
  try {
    const reportId = req.params.id;

    // Update the reportstatus to true
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { reportstatus: true },
    });

    // Respond with a JSON success message
    res.json({ success: true, message: 'Report status updated successfully', updatedReport });
  } catch (error) {
    console.error('Error updating report status:', error);

    // Respond with a JSON error message
    res.status(500).json({ success: false, message: 'Error updating report status' });
  }
});




module.exports = router;
