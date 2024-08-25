const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

//Test route || GET
router.get('/test-get', testController)

module.exports = router;