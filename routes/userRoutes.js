const express = require('express');
const userAuthMiddlerware = require('../middleware/authMiddleware');
const { updateUserMiddleware } = require('../controllers/userMiddlerware');

const router = express.Router();

//route

// Get user || GET


// Update User || PUT
router.put("/updateUser", userAuthMiddlerware, updateUserMiddleware)


module.exports = router;