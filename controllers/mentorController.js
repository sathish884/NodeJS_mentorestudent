const Mentor = require('../models/mentor');

// Create Mentor
const createMentor = async (req, res, next) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(200).json({
            message: "Successfully created",
            data: mentor
        });
    } catch (error) {
        res.status(500).jason({ message: error });
    }
}

module.exports = createMentor;