const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: { type: Number, unique: true, required: true }, // Sequential ID
    name: { type: String, required: true },
    age: { type: Number, required: false },
    assignedMentor: { type: Number, required: false }, // Mentor ID reference
    previousMentors: [{ type: Number }]
});

module.exports = mongoose.model('Students', studentSchema);
