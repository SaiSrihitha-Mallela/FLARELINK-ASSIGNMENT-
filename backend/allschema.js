const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
    isCompleted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
});

const Task = mongoose.model('Tasks', TaskSchema);
module.exports = Task;
