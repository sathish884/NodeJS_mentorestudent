const express = require("express");
const createMentor = require("../controllers/mentorController");

const router = express.Router();

// Create Mentor
router.route("/createMentor").post(createMentor);

module.exports = router;