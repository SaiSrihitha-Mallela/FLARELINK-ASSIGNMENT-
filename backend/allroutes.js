let express = require("express");
const Task = require('./allschema');
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");
let allroutes = express.Router();
allroutes.use(express.json());



allroutes.get('/', (req, res) => {
    console.log(" reached root");
    res.send("TO-DO-LIST");
});

//post to mongodb
// POST route to create a new task
allroutes.post('/tasks', async (req, res) => {
    console.log("data is reached to backend")
    const { title, description, startDate, endDate, priority, isImportant } = req.body;

    // Check if all required fields are present
    if (!title || !description || !startDate || !endDate || !priority) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        // Create a new task instance
        const task = new Task({
            title,
            description,
            startDate,
            endDate,
            priority,
            // isImportant: isImportant || false  // Default isImportant to false if not provided
        });

        // Save the task to the database
        await task.save();
        console.log("data is saved in mongo");
        res.status(201).json(task);  // Respond with the created task
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// Get all active tasks (not completed or deleted)
allroutes.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ isCompleted: false, isDeleted: false });  // Fetch all tasks
        console.log("data is fetched from backend");
        res.status(200).json(tasks);  // Return tasks in the response
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Update a task
allroutes.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = req.body;
        const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// Get completed tasks
allroutes.get('/tasks/completed', async (req, res) => {
    try {
        const tasks = await Task.find({ isCompleted: true });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed tasks', error });
    }
});

// Mark a task as completed
allroutes.patch('/tasks/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error completing task', error });
    }
});

// Get deleted tasks (in the bin)
allroutes.get('/tasks/deleted', async (req, res) => {
    try {
        const tasks = await Task.find({ isDeleted: true });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deleted tasks', error });
    }
});

// Soft-delete a task (move to bin)
allroutes.patch('/tasks/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

// Permanently delete a task
allroutes.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: 'Task permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error permanently deleting task', error });
    }
});

// Get tasks with High priority
allroutes.get('/tasks/important', async (req, res) => {
    try {
        const tasks = await Task.find({ priority: 'High', isCompleted: false, isDeleted: false });
        res.status(200).json(tasks); // Return tasks with High priority
    } catch (error) {
        console.error('Error fetching important tasks:', error);
        res.status(500).json({ message: 'Error fetching important tasks', error });
    }
});

// Search tasks by title
allroutes.get('/tasks/search', async (req, res) => {
    const { name } = req.query;
    try {
        const tasks = await Task.find({
            title: { $regex: name, $options: 'i' }, // case-insensitive search
            isDeleted: false, // Only show non-deleted tasks
            isCompleted: false // Only show non-completed tasks
        });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});


// Get task statistics (total, active, completed, important, overdue, upcoming)
allroutes.get('/task-stats', async (req, res) => {
    try {
        // Get counts of different task categories
        const totalTasks = await Task.countDocuments();
        const activeTasks = await Task.countDocuments({ isCompleted: false, isDeleted: false });
        const completedTasks = await Task.countDocuments({ isCompleted: true, isDeleted: false });
        const importantTasks = await Task.countDocuments({ priority: 'High', isDeleted: false });
        const overdueTasks = await Task.countDocuments({
            endDate: { $lt: new Date() },
            isCompleted: false,
            isDeleted: false
        });

        // Get upcoming tasks (tasks whose end date is within the next 7 days)
        const upcomingTasks = await Task.countDocuments({
            endDate: { $gte: new Date(), $lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            isDeleted: false
        });

        // Get task distribution by priority
        const priorityDistribution = await Task.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
            { $project: { priority: "$_id", count: 1, _id: 0 } }
        ]);

        res.status(200).json({
            totalTasks,
            activeTasks,
            completedTasks,
            importantTasks,
            overdueTasks,
            upcomingTasks,
            priorityDistribution
        });
    } catch (error) {
        console.error('Error fetching task stats:', error);
        res.status(500).json({ message: 'Error fetching task stats', error });
    }
});


module.exports = allroutes;