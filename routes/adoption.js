const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer'); // Require Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files




module.exports = router;
                