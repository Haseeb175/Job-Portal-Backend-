const jobsModel = require("../models/jobsModel");
const mongoose = require('mongoose');
const moment = require('moment');


// Create Jobs Controller
const createJobsController = async (req, res, next) => {
    const { company, position, status, workType, workLocation } = req.body;
    if (!company || !position) {
        next("Please Provide All Fields");
    }
    req.body.createdBy = req.user.userID;

    const jobs = await jobsModel.create(req.body);
    res.status(201).send({
        success: true,
        message: 'Job Created Successfully',
        jobs
    })
}

// Get ALl jobs Controllers
const getAllJobsControllers = async (req, res, next) => {

    // Searching Jobs in Status 
    const { status, workType, search, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userID
    }

    // Logic Filter in Status
    if (status && status !== 'all') {
        queryObject.status = status
    }

    // Logic Filter in Work Type
    if (workType && workType !== 'all') {
        queryObject.workType = workType
    }

    // Login Filter in Position Through Search  (regex) => find half word through search 
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' } // i => case insensitive 
    }

    let queryResult = jobsModel.find(queryObject);

    //Sorting by latest date
    if (sort === 'latest') {
        queryResult = queryResult.sort("-createdAt")
    }
    //Sorting by oldest date
    if (sort === 'oldest') {
        queryResult = queryResult.sort('createdAt')
    }
    //Sorting by A to z Order
    if (sort === 'a-z') {
        queryResult = queryResult.sort('position')
    }
    //Sorting by Z to A Order
    if (sort === 'z-a') {
        queryResult = queryResult.sort('-position')
    }

    // Pagination 
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    // Total Jobs Count
    const totalJobs = await jobsModel.countDocuments(queryResult);

    // Skip Pervious page Data
    queryResult = queryResult.skip(skip).limit(limit);

    // Page Jobs Counts
    let pageJobsCount = await jobsModel.countDocuments(queryResult);

    // Number of Pages Count
    const numOfTotalPages = Math.ceil(totalJobs / limit);
    const Jobs = await queryResult;

    // const jobs = await jobsModel.find({ createdBy: req.user.userID });
    // if (!jobs) {
    //     next("No Jobs Founds")
    // }
    res.status(200).send({
        success: true,
        totalJobs,
        numOfTotalPages,
        pageJobsCount,
        Jobs
    })
}

// Update Job By ID Contoller
const updateJobController = async (req, res, next) => {
    const { company, position, status, workType, workLocation } = req.body;
    const { id } = req.params;
    if (!company || !position) {
        next("Please Provide All Fields");
    }

    const job = await jobsModel.findOne({ _id: id });
    if (!job) {
        next(`No Job Found to this ${id} id`)
    }
    // Validation For User
    if (!(req.user.userID === job.createdBy.toString())) {
        next("You are Not Authorized to Update This Job");
        return;
    }
    // Updated
    const updateJob = await jobsModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.status(200).send({
        success: true,
        message: "Job Update Successfully",
        updateJob
    })
}

// Delete Job Controller
const deleteJobController = async (req, res, next) => {

    const { id } = req.params;

    const job = await jobsModel.findOne({ _id: id });

    if (!job) {
        next(`No job Found to this ID`);
    }

    if (!(req.user.userID === job.createdBy.toString())) {
        next("You are Not Authorized to Delete this Job");
        return;
    }
    // await job.deleteOne();
    const deleteJob = await jobsModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
        success: true,
        message: "Job Delete Successfully",
        deleteJob
    })
}


// Get Jobs Stats & Filter
const getJobStats = async (req, res) => {

    // stats filter
    const stats = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userID)
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }])


    // Monthly and yearly stats
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userID)
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    // formate year and month by moment libary
    monthlyApplication = monthlyApplication.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format("MMM Y");
        return { date, count };
    }).reverse();

    res.status(200).send({
        success: true,
        totalJobs: stats.length,
        stats,
        monthlyApplication
    });
}

module.exports = { createJobsController, getAllJobsControllers, updateJobController, deleteJobController, getJobStats }