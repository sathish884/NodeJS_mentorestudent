const express = require("express");
const bodyparser = require("body-parser");
const corse = require("cors");
const mongoose = require("mongoose");
const StudentRouter = require("./routes/studentRoute");
const MentorRouter = require("./routes/mentorRoute");
require("dotenv").config();

const app = express();
app.use(corse());
app.use(bodyparser.json());

// define the port the server will run on
const PORT = process.env.PORT || 3000;

// Students
app.use("/api", StudentRouter);
// Mentors
app.use("/api", MentorRouter);

app.get("/", (req, res) => {
    res.json({ message: "Mentor and Student Deployed Successfully" });
})

mongoose.connect(process.env.MONGODB).then(() => {
    console.log("MongoDB is connected");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

}).catch(error => {
    console.log("Connection was filed ", error.message);
})

