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

// GET route to fetch all tasks
allroutes.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();  // Fetch all tasks
        console.log("data is fetched from backend");
        res.status(200).json(tasks);  // Return tasks in the response
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});


module.exports = allroutes;