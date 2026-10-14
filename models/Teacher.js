const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacherId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // Simple plain text for lab purpose
    departmentName: { type: String, required: true },
    numberOfCourses: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Teacher', teacherSchema);