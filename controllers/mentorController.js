const Counter = require('../models/counter');
const Mentor = require('../models/mentor');


async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
       { _id: name },                // Filter by counter name
        { $inc: { seq: 1 } },         // Increment the sequence by 1
        { new: true, upsert: true }   // Return the updated document, create if not exists
    );
    return counter.seq;
}

// Create Mentor
const createMentor = async (req, res) => {
    try {
        const mentorIds = await getNextSequence('mentorId');
        const mentor = new Mentor({
            mentorId: mentorIds, // Use the generated sequence number as the ID
            ...req.body
        });
        await mentor.save();
        res.status(200).json({ message: "Successfully created", data: mentor });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ errorMsg: "Internal Server Error" });
    }
}

module.exports = createMentor;