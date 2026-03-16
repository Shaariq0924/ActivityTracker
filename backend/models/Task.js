const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
    timeSpent: {
        type: Number, // in minutes
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
