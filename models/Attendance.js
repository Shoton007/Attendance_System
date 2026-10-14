const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);