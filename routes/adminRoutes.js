const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

const session = require('express-session');






router.use(session({
  secret: 'samplekey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


/* GET login page. */
router.get('/login', async function (req, res, next) {
  res.render('login', { title: 'Login' });
});

/* POST login. */
router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email } // Assuming email is unique
    });

    if (!user) {
      res.status(401).render('login', { title: 'Login', errorMessage: 'Invalid username or password' });
      return;
    }

    // Directly compare the provided password with the stored password
    if (password === user.password) {
      // Store the user object in the session
      req.session.user = user;

      // Redirect to the admin homepage
      res.redirect('/admin/admindashboard');
    } else {
      res.status(401).render('login', { title: 'Login', errorMessage: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    // Handle any errors here
    res.status(500).send('Error');
  }
});

// wag mo na to galawin cha sa signup to 

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async function (req, res, next) {
  const { fullname, username, email, password } = req.body;
  try {
    // Create a new admin user (in a real application, you would save it to a database)
    const user = await prisma.user.create({
      data: {
        fullname,
        username,
        email,
        password,
      },
    });


    // Redirect to login page after successful signup
    res.redirect('/admin/login');

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      // Handle the case where the username already exists
      return res.status(400).send('Username already exists');
    }

  } catch (error) {
    console.error(error);
  }

});

// Define a middleware function to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Check if the user object is present in the session
  if (req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/admin/login');
  }
};

// List of routes that require authentication
const protectedRoutes = [
  '/admindashboard',
  '/add-pet',
  '/edit-pet/:id',
  '/list-pets',
  '/delete-pet/:id',
];
router.use(protectedRoutes, isAuthenticated);


router.get('/admindashboard', async function (req, res, next) {
  try {
    const contactFormEntries = await prisma.contactFormEntry.findMany(); // Fetch all entries from the ContactFormEntry model
    const totalPets = await prisma.pet.count(); // Count total pets
    const totalReports = await prisma.report.count();
    // Count archived surrenders
    const totalArchivedSurrenders = await prisma.surrender.count({
      where: {
        archived: true
      }
    });

   
    

    res.render('admindashboard', { 
      title: 'Dashboard',
      contactFormEntries,
      totalPets,
      totalArchivedSurrenders,
      totalReports
    });
  } catch (error) {
    next(error);
  }
});





router.post('/pets', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]), async (req, res) => {
  try {
    const { name, breed, color, gender, description, petType } = req.body;
    const age = parseInt(req.body.age); // Convert age to a number

    // Get the paths to the uploaded images
    const image = req.files['image'] ? req.files['image'][0].path : null;
    const image2 = req.files['image2'] ? req.files['image2'][0].path : null;
    const image3 = req.files['image3'] ? req.files['image3'][0].path : null;
    const image4 = req.files['image4'] ? req.files['image4'][0].path : null;

    const newPet = await prisma.pet.create({
      data: {
        name,
        breed,
        age,
        color,
        gender,
        description,
        image,
        image2,
        image3,
        image4,
        petType,
      }
    });

    // Redirect to the admin dashboard after successfully adding a pet
    res.redirect('/admin/admindashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create pet' });
  }
});




// Get all pets
router.get('/pets', async (req, res) => {
  try {
    const pets = await prisma.pet.findMany();
    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch pets' });
  }
});

// Get a single pet by ID
router.get('/pets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });
    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
    } else {
      res.json(pet);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch pet' });
  }
});

// Update a pet by ID using PUT
router.post('/pets/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // Assuming your request body contains the updated pet data

  try {
    // Log the received data for debugging
    console.log('Received data for update:', updatedData);

    // Use Prisma to update the pet based on the received data
    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        name: updatedData.name,
        breed: updatedData.breed,
        age: parseInt(updatedData.age), // Convert age to integer
        color: updatedData.color,
        gender: updatedData.gender,
      },
    });

    // Log the updated pet for debugging
    console.log('Updated pet:', updatedPet);

    // Redirect to the "view-pet" page for the specific pet
    res.redirect(`/admin/view-pet/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update pet' });
  }
});




// Render the "Edit Pet" form for a specific pet by ID
router.get('/edit-pet/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });
    if (!pet) {
      res.status(404).render('error', { message: 'Pet not found' });
    } else {
      res.render('edit-pet', { title: 'Edit Pet', pet });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error' });
  }
});

// Delete a pet by ID
router.delete('/pets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPet = await prisma.pet.delete({
      where: { id },
    });
    res.json(deletedPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete pet' });
  }
});

// Render the "Add Pet" form
router.get('/add-pet', (req, res) => {
  res.render('add-pet', { title: 'Add Pet' });
});

// Render the "View Pet" page for a specific pet by ID
router.get('/view-pet/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });
    if (!pet) {
      res.status(404).render('error', { message: 'Pet not found' });
    } else {
      res.render('view-pet', { title: 'View Pet', pet });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error' });
  }
});



// Render the "List Pets" page with a list of all pets
router.get('/list-pets', async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {adopted: false,},
    });
    const petsWithDefaultType = pets.map((pet) => ({
      ...pet,
      petType: pet.petType || 'Unknown',
    }));
    res.render('list-pets', { title: 'List Pets', pets: petsWithDefaultType });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error' });
  }
});

router.post('/submit-detail', async (req, res) => {
  try {
    const { name, type, breed, adopter, address, contact, date } = req.body;

    // Use Prisma client to create a new adopt in the database
    const newAdopt = await prisma.adopt.create({
      data: {
        name,
        type,
        breed,
        adopter,
        address,
        contact,
        date: new Date(date), // Ensure the date is parsed correctly
      },
    });

    console.log('Detail created:', newAdopt);

    // Send a success response
    res.status(200).json({ message: 'Pet is now adopted' });
  } catch (error) {
    console.error('Error saving detail:', error);
    res.status(500).json({ error: 'Error saving detail' });
  }
});







// Delete a pet by ID
router.post('/delete-pet/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPet = await prisma.pet.delete({
      where: { id },
    });
    if (!deletedPet) {
      res.status(404).render('error', { message: 'Pet not found' });
    } else {
      res.redirect('/admin/list-pets'); // Redirect to the list of pets after deletion
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error' });
  }
});

module.exports = router;
