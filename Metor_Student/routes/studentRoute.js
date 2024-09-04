const express = require("express");
const studentController = require("../controllers/studentController");

const router = express.Router();

// Create Student
router.route("/createStudent").post(studentController.createStudents);

// assigned mentors to student or updates mentor
router.route("/assigned").put(studentController.assignedMentor);

// assigned multiple students to mentor
router.route("/assign-students").put(studentController.assignMultipleStudents);

// get un-assigned student list
router.route("/getUnassignedStudents").get(studentController.getUnassignedStudents);

// get assigned students for mentor
router.route("/mentor").get(studentController.getStudentsForMentor);

// get previous mentors for students
router.route("/student/previousMentor").get(studentController.getPreviousMentorsForStudent);

module.exports = router;