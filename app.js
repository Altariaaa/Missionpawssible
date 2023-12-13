const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { PrismaClient } = require('@prisma/client'); // Import the Prisma client
const session = require('express-session'); // Import express-session
const bodyParser = require('body-parser');
const multer = require('multer'); // Import multer





const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adoptRouter = require('./routes/adopt');
const petdetailsRouter = require('./routes/petdetails');
const surrenderRouter = require('./routes/surrender');
const reportRouter = require('./routes/report');
const donateRouter = require('./routes/donate');
const adminRoutes = require('./routes/adminRoutes');
const adminadoptions = require('./routes/adminadoptions');
const adminrequests = require('./routes/adminrequests');
const admindonate = require('./routes/admindonate');
const adminsurrender = require('./routes/adminsurrender');
const adminreport = require('./routes/adminreport');
const emailSender = require('./routes/emailSender');
const emailSenderReport = require('./routes/emailSenderReport');
const emailSenderPetRequest = require('./routes/emailSenderPetRequest');
const emailSenderAdopt = require('./routes/emailSenderAdopt');
const requestarchives = require('./routes/requestarchives');
const surrenderarchives = require('./routes/surrenderarchives');
const petrequestarchives = require('./routes/petrequestarchives');
const reportarchives = require('./routes/reportarchives');
const adoptedarchives = require('./routes/adoptedarchives');
const adoptedpets = require('./routes/adoptedpets');

const app = express();
const prisma = new PrismaClient(); // Create a Prisma client instance\
app.use(bodyParser.urlencoded({ extended: true }));


// Set the view engine and views directory
app.set('view engine', 'ejs'); // Use EJS as the view engine
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    secret: 'samplekey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', adoptRouter);
app.use('/', petdetailsRouter);
app.use('/', surrenderRouter);
app.use('/', reportRouter);
app.use('/', donateRouter);
app.use('/admin', adminRoutes);
app.use('/admin', adminadoptions);
app.use('/admin', adminrequests);
app.use('/admin', admindonate);
app.use('/admin', adminsurrender);
app.use('/admin', adminreport);
app.use('/admin', require('./routes/adminRoutes'));
app.use('/admin', emailSender);
app.use('/admin', emailSenderAdopt);
app.use('/admin', emailSenderPetRequest);
app.use('/admin', emailSenderReport);
app.use('/admin/requestarchives', requestarchives);
app.use('/admin/surrenderarchives', surrenderarchives);
app.use('/admin/petrequestarchives', petrequestarchives);
app.use('/admin/reportarchives', reportarchives);
app.use('/admin/adoptedarchives', adoptedarchives);
app.use('/admin', adoptedpets);

app.use(function(req, res, next) {
  next(createError(404));
});


// Error handling middleware
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error'); // Renders the "error" view for error handling
});






module.exports = app;
