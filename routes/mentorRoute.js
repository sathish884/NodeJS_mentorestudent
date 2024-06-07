const express = require("express");
const Mentor = require("../models/mentor");

const router = express.Router();

router.post("/createMentor", async (req, res) => {
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
})