// Import required modules
let express = require('express');
let app = express();
// const Task = require('./allschema'); // Assuming this is your Task schema file\
const allroutes = require('./allroutes');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.options('*', cors()); // Handle preflight requests for all routes

//routes
app.use('/api',allroutes);


// Basic route to check if the server is up
app.use("/", async (req, res) => {
    res.send("To-Do List API is up and running!");
});

// MongoDB connection
let db = async () => {
    try {
        await mongoose.connect(process.env.DBURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
};
db();


// Start the server
app.listen(5000, () => {
    console.log('Backend listening at http://localhost:5000');
});
