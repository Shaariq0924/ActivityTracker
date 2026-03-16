const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly'],
        default: 'Daily',
    },
    streak: {
        type: Number,
        default: 0,
    },
    lastCompleted: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
