const Counter = require('../models/counter');
const Mentor = require('../models/mentor');
const Students = require('../models/student');

async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { _id: name },                // Filter by counter name
        { $inc: { seq: 1 } },         // Increment the sequence by 1
        { new: true, upsert: true }   // Return the updated document, create if not exists
    );
    return counter.seq;
}

// Create Student
exports.createStudents = async (req, res, next) => {
    try {
        const studentIds = await getNextSequence('studentId');
        const student = new Students({
            studentId: studentIds, // Use the generated sequence number as the ID
            ...req.body
        });
        await student.save();
        res.status(200).json({ message: "Successfully created", data: student });
    } catch (error) {
        res.status(500).json({ errorMsg: error.message });
    }
};

// assigned student to mentor
exports.assignedMentor = async (req, res) => {
    const { studentId, mentorId } = req.body;

    try {
        // Check if student exists using studentId
        const student = await Students.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if mentor exists using mentorId
        const mentor = await Mentor.findOne({ mentorId });
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        // Assign mentor to student
        student.assignedMentor = mentorId;
        await student.save();

        res.status(200).json({ message: "Student assigned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.assignMultipleStudents = async (req, res) => {
    const { mentorId, studentIds } = req.body;

    try {
        // Check if the mentor exists
        const mentor = await Mentor.findOne({ mentorId: Number(mentorId) });
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        // Update the students with the new mentor
        const result = await Students.updateMany(
            { studentId: { $in: studentIds.map(Number) } },
            {
                $set: { assignedMentor: Number(mentorId) },
                $push: {
                    previousMentors: {
                        $each: [Number(mentorId)],
                        $position: 0
                    }
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No students were assigned. They might already have a mentor." });
        }
        res.status(200).json({ message: "Students assigned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// not assigned mentors student list
exports.getUnassignedStudents = async (req, res) => {
    try {
        const students = await Students.find({ assignedMentor: { $exists: false } });
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

// Get all students assigned to a particular mentor
exports.getStudentsForMentor = async (req, res) => {

    const mentorId = req.query.mentorId; // Read mentorId from query parameters

    if (!mentorId) {
        return res.status(400).json({ message: "mentorId query parameter is required" });
    }

    try {
        const mentor = await Mentor.findOne({ mentorId: mentorId });
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        const students = await Students.find({ assignedMentor: Number(mentorId) });

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getPreviousMentorsForStudent = async (req, res) => {
    const studentId = Number(req.query.studentId);

    try {
        const student = await Students.findOne({ studentId });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.previousMentors.length === 0) {
            return res.status(200).json([]);
        }

        const previousMentors = await Mentor.find({
            mentorId: { $in: student.previousMentors.map(Number) }  // Ensure correct type matching
        });

        res.status(200).json(previousMentors);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

