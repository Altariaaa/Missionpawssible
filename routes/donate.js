const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/donate', async (req, res) => {
  try {
    // Fetch data from MongoDB using Prisma
    const donations = await prisma.donation.findMany({
      select: {
        date: true,
        amount: true,
      },
      orderBy: {
        date: 'asc', // You might want to order by date
      },
    });

    // Extracting dates and amounts
    const labels = donations.map((donation) => donation.date.toLocaleDateString());
    const amounts = donations.map((donation) => donation.amount);

    // Calculate total donations
    const totalDonations = amounts.reduce((acc, curr) => acc + curr, 0);

    res.render('donate', {
      labels: JSON.stringify(labels),
      amounts: JSON.stringify(amounts),
      totalDonations: totalDonations,
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;
