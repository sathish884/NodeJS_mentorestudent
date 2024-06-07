const express = require("express");
const Students = require("../models/student");

const router = express.Router();

// create student
router.post("/createStudent", async (req, res) => {
    try {
        const student = new Students(req.body);
        await student.save();
        res.status(200).json({ message: "Successfully created", data: student });
    } catch (error) {
        res.send(500).json({ errorMsg: error })
    }
});

module.exports = router;