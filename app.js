const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

const mysql = require('./util/mysql');
mysql.setup();

// Global Constants
const API_URL_PREFIX = '/api';

// Controllers
const errorController = require('./controllers/error');

// Routes
const globalRouter = require('./routes/index');
const propertyRouter = require('./routes/property');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// API Routes
app.use(API_URL_PREFIX, globalRouter);
app.use(`${API_URL_PREFIX}/property`, propertyRouter);

// Error Handling
app.use(errorController.catch404);
app.use(errorController.handle);

module.exports = app;
