const Students = require('../models/student');

// Create Student
exports.createStudents = async (req, res, next) => {
    try {
        const student = new Students(req.body);
        await student.save();
        res.status(200).json({ message: "Successfully created", data: student });
    } catch (error) {
        res.send(500).json({ errorMsg: error })
    }
};

//module.exports = createStudents;


