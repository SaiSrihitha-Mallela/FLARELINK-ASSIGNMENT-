const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    discription: { type: String, required: true },
    startdate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
    isImportant: {type: Boolean, defalut:false},
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;