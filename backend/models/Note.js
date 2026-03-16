const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
