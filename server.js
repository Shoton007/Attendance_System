const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// CORS allow kora hocche jate internet theke kono block na khay
app.use(cors());
app.use(express.json());

const dbURI = process.env.MONGO_URI || 'mongodb://Shoton_Ahamed:Shoton2002@ac-bculy8t-shard-00-00.m3dfwb5.mongodb.net:27017,ac-bculy8t-shard-00-01.m3dfwb5.mongodb.net:27017,ac-bculy8t-shard-00-02.m3dfwb5.mongodb.net:27017/Attendance_System?ssl=true&authSource=admin&retryWrites=true&w=majority';

// Database Connect kora hocche
mongoose.connect(dbURI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
    .catch(err => console.error("❌ Database Connection Error:", err));

// Route setup
app.use('/api', apiRoutes);

// Render-er jonno dynamic Port set kora
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));