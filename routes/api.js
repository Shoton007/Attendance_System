const express = require('express');
const router = express.Router();

const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

router.post('/signup', async (req, res) => {
    try {
        const { teacherId, name, password, departmentName } = req.body;
        const existingTeacher = await Teacher.findOne({ teacherId });
        if (existingTeacher) return res.status(400).json({ success: false, message: "Teacher ID already exists!" });

        const newTeacher = new Teacher({ teacherId, name, password, departmentName, numberOfCourses: 0 });
        await newTeacher.save();
        res.json({ success: true, message: "Signup successful!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.post('/login', async (req, res) => {
    try {
        const { teacherId, password } = req.body;
        const teacher = await Teacher.findOne({ teacherId: teacherId, password: password });
        if (teacher) res.json({ success: true, teacher });
        else res.status(401).json({ success: false, message: "Invalid ID or Password" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.get('/courses/:teacherDbId', async (req, res) => {
    try {
        const courses = await Course.find({ teacherId: req.params.teacherDbId });
        res.json(courses);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/students/:courseDbId', async (req, res) => {
    try {
        const students = await Student.find({ courseId: req.params.courseDbId })
            .collation({ locale: "en_US", numericOrdering: true }) 
            .sort({ rollNo: 1 });
        res.json(students);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/attendance', async (req, res) => {
    try {
        const records = req.body; 
        if (records.length > 0) {
            const date = records[0].date;
            const courseId = records[0].courseId;
            await Attendance.deleteMany({ date: date, courseId: courseId });
            await Attendance.insertMany(records);
        }
        res.json({ success: true, message: "Attendance saved/updated successfully!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.get('/report/:courseDbId', async (req, res) => {
    try {
        const records = await Attendance.find({ courseId: req.params.courseDbId })
            .populate('studentId')
            .sort({ date: -1 }); 
        res.json(records);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Add Course - Session add kora hoyeche
router.post('/courses/add', async (req, res) => {
    try {
        const { courseId, courseName, classTime, year, semester, session, teacherId } = req.body;
        const newCourse = new Course({ courseId, courseName, classTime, year, semester, session, teacherId });
        const savedCourse = await newCourse.save();
        await Teacher.findByIdAndUpdate(teacherId, { $inc: { numberOfCourses: 1 } });
        res.json({ success: true, course: savedCourse, message: "Course added successfully!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.post('/students/add', async (req, res) => {
    try {
        const { studentId, name, rollNo, courseId } = req.body;
        const newStudent = new Student({ studentId, name, rollNo, courseId });
        await newStudent.save();
        res.json({ success: true, message: "Student added successfully!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// Edit Course - Session add kora hoyeche
router.put('/courses/edit/:id', async (req, res) => {
    try {
        const { courseId, courseName, classTime, year, semester, session } = req.body;
        await Course.findByIdAndUpdate(req.params.id, { courseId, courseName, classTime, year, semester, session });
        res.json({ success: true, message: "Course updated successfully!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.put('/students/edit/:id', async (req, res) => {
    try {
        const { rollNo, name } = req.body;
        await Student.findByIdAndUpdate(req.params.id, { rollNo, name });
        res.json({ success: true, message: "Student updated successfully!" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

module.exports = router;