// server.js (Final Corrected Version)

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARES ===
// Yeh dono lines routes se hamesha pehle honi chahiye
app.use(cors());
app.use(express.json());

// === DATABASE CONNECTION ===
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// === API ROUTES ===
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// === START SERVER ===
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});