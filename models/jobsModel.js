const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({

    company: {
        type: String,
        required: [true, "Please Provide Company"]
    },
    position: {
        type: String,
        required: [true, "Please Provide Position"]
    },
    status: {
        type: String,
        enum: ['pending', 'reject', 'interview'],
        default: 'pending'
    },
    workType: {
        type: String,
        enum: ['Full-Time', 'Half-Time', 'Internship', 'Contract'],
        default: 'Full-Time'
    },
    workLocation: {
        type: String,
        required: [true, "Please Provide Position"],
        default: 'Islamabad'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Jobs', jobsSchema)