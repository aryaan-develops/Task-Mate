
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// POST /api/admin/assign-task
// Protected by Auth AND Admin middleware
router.post('/assign-task', [auth, admin], async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate } = req.body;

        // Create the task
        const task = new Task({
            name: title, // Mapping title to name
            description,
            user: assignedTo, // assigning to this user
            assignedBy: req.user.id,
            priority: priority || 'Medium',
            status: 'pending',
            dueDate
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/admin/assigned-tasks
// Fetch tasks assigned BY the logged-in admin
router.get('/assigned-tasks', [auth, admin], async (req, res) => {
    try {
        const tasks = await Task.find({ assignedBy: req.user.id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// GET /api/admin/user-progress
router.get('/user-progress', [auth, admin], async (req, res) => {
    try {
        const progressData = await Task.aggregate([
            { $match: { assignedBy: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: "$user",
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    pendingTasks: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    inProgressTasks: {
                        $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    totalTasks: 1,
                    completedTasks: 1,
                    pendingTasks: 1,
                    inProgressTasks: 1
                }
            }
        ]);

        res.json(progressData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
