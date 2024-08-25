const express = require('express');
const userAuthMiddlerware = require('../middleware/authMiddleware');
const { createJobsController, getAllJobsControllers, updateJobController, deleteJobController, getJobStats } = require('../controllers/jobsController');

const router = express.Router();

// route

// Create Jobs || POST
router.post('/createJobs', userAuthMiddlerware, createJobsController);

// Get All Jobs || GET
router.get('/getAllJobs', userAuthMiddlerware, getAllJobsControllers);

// Update jobs By ID || PUT
router.put("/updateJob/:id", userAuthMiddlerware, updateJobController);

// Delete Jobs By ID || DELETE
router.delete("/deleteJob/:id", userAuthMiddlerware, deleteJobController);

// Get Jobs Stats || GET
router.get("/jobStats", userAuthMiddlerware, getJobStats);


module.exports = router;