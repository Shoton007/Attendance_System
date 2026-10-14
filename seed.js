require('dotenv').config();
const mongoose = require('mongoose');

// Models
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const Student = require('./models/Student');

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected for Seeding'))
  .catch((err) => console.log('❌ DB Connection Error:', err));

const seedDatabase = async () => {
    try {
        // 1. Aager shob data delete kore dicchi (jate duplicate na hoy)
        await Teacher.deleteMany({});
        await Course.deleteMany({});
        await Student.deleteMany({});
        console.log('🧹 Old Data Cleared!');

        // 2. Ekjon Teacher toiri korchi
        const teacher1 = new Teacher({
            teacherId: "T-101",
            name: "John Doe",
            password: "123", // Password khub simple rakhlam
            departmentName: "Computer Science",
            numberOfCourses: 2
        });
        const savedTeacher = await teacher1.save();
        console.log('👤 Teacher Added:', savedTeacher.name);

        // 3. Teacher-er jonno Course toiri korchi
        const course1 = new Course({
            courseId: "CSE-401",
            courseName: "Software Engineering Lab",
            classTime: "10:00 AM - 12:00 PM",
            teacherId: savedTeacher._id
        });
        const savedCourse = await course1.save();
        console.log('📚 Course Added:', savedCourse.courseName);

        // 4. Course-er jonno kisu Student toiri korchi
        const students = [
            { studentId: "S-01", name: "Alice Smith", rollNo: "1001", courseId: savedCourse._id },
            { studentId: "S-02", name: "Bob Johnson", rollNo: "1002", courseId: savedCourse._id },
            { studentId: "S-03", name: "Charlie Brown", rollNo: "1003", courseId: savedCourse._id }
        ];
        await Student.insertMany(students);
        console.log('🎓 3 Students Added!');

        console.log('🎉 All Dummy Data Seeded Successfully!');
        process.exit(); // Kaj sheshe script bondho hoye jabe
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

// Function ta run kora
seedDatabase();