
const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

// ROUTE 1: Create Task (POST) - Private
router.post('/', auth, async (req, res) => {
    try {
        const { name, priority, dueDate } = req.body;
        const task = new Task({
            name,
            priority,
            dueDate,
            user: req.user.id // Associate task with logged in user
        });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ROUTE 2: Get All Tasks (GET) - Private
router.get('/', auth, async (req, res) => {
    try {
        // If user is admin, they might want to see all tasks? 
        // For now, let's just show the user's own tasks as requested by "Dashboard" logic
        // But if we want Admin specific views later, we can check req.user.role

        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ROUTE 3: Update Task (PUT) - Private
router.put('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields if they exist in req.body
        if (req.body.name) task.name = req.body.name;
        if (req.body.description) task.description = req.body.description;
        if (req.body.priority) task.priority = req.body.priority;
        if (req.body.dueDate) task.dueDate = req.body.dueDate;

        // Handle Status
        if (req.body.status) {
            task.status = req.body.status;
            // Sync completed boolean with status
            if (task.status === 'completed') task.completed = true;
            else task.completed = false;
        }

        // Handle explicit completed field if sent
        if (req.body.completed !== undefined) {
            task.completed = req.body.completed;
            // Sync status with completed boolean if status wasn't explicitly sent
            if (!req.body.status) {
                task.status = task.completed ? 'completed' : 'pending';
            }
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ROUTE 4: Delete Task (DELETE) - Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;