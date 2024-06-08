const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const StudentRouter = require("./routes/studentRoute");
const MentorRouter = require("./routes/mentorRoute");

require("dotenv").config();

const app = express();
app.use(bodyparser.json());

// Students
app.use("/api", StudentRouter);
// Mentors
app.use("/api", MentorRouter);

mongoose.connect(process.env.MONGODB).then(() => {
    console.log("MongoDB is connected");

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

}).catch(error => {
    console.log("Connection was filed ", error.message);
})

