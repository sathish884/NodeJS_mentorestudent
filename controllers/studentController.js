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
    //const { name, age} = req.body;
    try {
        const studentIds = await getNextSequence('studentId');
        const student = new Students({
            studentId: studentIds, // Use the generated sequence number as the ID
            ...req.body
        });
        await student.save();
        res.status(200).json({ message: "Successfully created", data: student });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ errorMsg: "Internal Server Error" });
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
        console.error("Error assigning mentor:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Assign multiple students to a mentor
exports.assignStudentsToMentor = async (req, res) => {
    const { mentorId, studentIds } = req.body;

    try {
        // Check if the mentor exists
        const mentor = await Mentor.findOne({ mentorId });
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        console.log(`Assigning mentorId: ${mentorId} to students: ${studentIds}`);

        // Update the students
        const students = await Students.updateMany(
            { studentId: { $in: studentIds } },
            [
                {
                    $set: {
                        assignedMentor: mentorId,
                        previousMentors: {
                            $cond: {
                                if: { $ne: ["$assignedMentor", null] },
                                then: { $concatArrays: ["$previousMentors", ["$assignedMentor"]] },
                                else: "$previousMentors"
                            }
                        }
                    }
                }
            ]
        );

        // Check the number of modified documents
        console.log(`Modified count: ${students.modifiedCount}`);

        if (students.modifiedCount === 0) {
            return res.status(400).json({ message: "No students were assigned. They might already have a mentor." });
        }

        res.status(200).json({ message: "Students assigned successfully" });
    } catch (error) {
        console.error("Error assigning students:", error);
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
        console.log(`Fetching mentor with mentorId: ${mentorId}`);
        const mentor = await Mentor.findOne({ mentorId: mentorId });
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        console.log(`Mentor found: ${mentor}`);
        console.log(`Fetching students assigned to mentorId: ${mentorId}`);
        const students = await Students.find({ assignedMentor: Number(mentorId) });

        console.log(`Students found: ${students}`);
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students for mentor:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get previously assigned mentors for a particular student
exports.getPreviousMentorsForStudent = async (req, res) => {
    const studentId = req.query.studentId; // Correctly retrieve studentId from query parameters

    console.log(`Received request to fetch previous mentors for studentId: ${studentId}`);

    try {
        console.log(`Fetching student with studentId: ${studentId}`);
        const student = await Students.findOne({ studentId: Number(studentId) }); // Ensure studentId is treated as a number

        if (!student) {
            console.log(`Student with studentId ${studentId} not found`);
            return res.status(404).json({ message: "Student not found" });
        }

        console.log(`Student found: ${student}`);
        console.log(`Previous mentors IDs: ${student.previousMentors}`);

        if (student.previousMentors.length === 0) {
            console.log(`No previous mentors found for studentId ${studentId}`);
            return res.status(200).json([]); // Return empty array if no previous mentors
        }

        const previousMentors = await Mentor.find({ mentorId: { $in: student.previousMentors } });

        console.log(`Previous mentors found: ${previousMentors}`);
        res.status(200).json(previousMentors);
    } catch (error) {
        console.error("Error fetching previous mentors for student:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};