const express = require("express");
const { createStudents } = require("../controllers/studentController");

const router = express.Router();

// Create Student
router.route("/createStudent").post(createStudents);

module.exports = router;