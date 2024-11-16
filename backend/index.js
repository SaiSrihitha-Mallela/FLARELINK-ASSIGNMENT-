let express = require('express');
let app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Task = require('./allschema');

app.use(express.json());

app.use(cors({credentials:true, origin:'http://localhost:300'}));

app.use("/",async(req,res)=>{
    res.send("To-Do List");
})

// mongo db connection 
let db = async()=>{
    try{
        // console.log(process.env.DBURI);
        await mongoose.connect(process.env.DBURI);
        console.log("Connected to MongoDB");
    }
    catch
    {
        console.log("Error connecting to MongoDB");
        

    }
}
db();


////creating routes/////

// Add a new task
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

// Get all tasks sorted by priority (High > Medium > Low)
app.get('/tasks/sorted', async (req, res) => {
    try {
        const tasks = await Task.find().sort({
            priority: {
                $case: { "High": 1, "Medium": 2, "Low": 3 }
            }
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Get tasks with High priority only
app.get('/tasks/high-priority', async (req, res) => {
    try {
        const highPriorityTasks = await Task.find({ priority: 'High' });
        res.status(200).json(highPriorityTasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching high-priority tasks', error });
    }
});



app.listen(5000,()=>{console.log('backend listening at port http://localhost:5000')});
