const express = require('express');
const router = new express.Router();

const globalController = require('../controllers/global');

router.get('/', globalController.home);

module.exports = router;
