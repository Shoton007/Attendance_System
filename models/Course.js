const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    classTime: { type: String, required: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    session: { type: String, required: true }, // Notun add kora holo (e.g. 2025-2026)
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

module.exports = mongoose.model('Course', courseSchema);