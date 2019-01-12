const express = require('express');
const router = new express.Router();

const propertyController = require('../controllers/property');

router.get('/', propertyController.search);  // Search property
router.post('/', propertyController.create); // Add property

module.exports = router;
