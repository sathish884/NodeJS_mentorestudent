const mongoose = require("mongoose");

const studentShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

const Students = mongoose.model("student", studentShema);

module.exports = Students