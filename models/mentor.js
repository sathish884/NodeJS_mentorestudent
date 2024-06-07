const mongoose = require("mongoose");

const mentorShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

const Mentor = mongoose.model("mentor", mentorShema);

module.exports = Mentor;