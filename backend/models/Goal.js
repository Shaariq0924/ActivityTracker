const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    target: {
        type: Number,
        required: true,
    },
    completed: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
