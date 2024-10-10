const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    mentorId: { type: Number, unique: true, required: true }, // Sequential ID
    name: { type: String, required: true }
});

module.exports = mongoose.model('Mentor', mentorSchema);

