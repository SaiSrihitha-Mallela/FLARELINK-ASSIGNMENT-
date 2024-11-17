import React from 'react';
import axios from 'axios';
import { useState,useEffect } from 'react';
import Sidebar from './SideBar';
import "./css/Tasks.css"
import SearchBar from './SearchBar';


const Tasks = () => {

    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        priority: 'Medium',
    });

    // Fetch tasks from backend
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            console.log("getting data");
            const response = await axios.get('http://localhost:5000/api/tasks');
            console.log("data has been fetched")
            console.log('Response data:', response.data);

            // Sort tasks based on priority
            const sortedTasks = response.data.sort((a, b) => {
                const priorities = { High: 1, Medium: 2, Low: 3 };
                return priorities[a.priority] - priorities[b.priority];
            });

            setTasks(sortedTasks); // Set tasks in state
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, description, startDate, endDate, priority } = formData;

        // Validation
        if (title && description && startDate && endDate && priority) {
            try {
                console.log("if statment is okay")
                // Create task via POST request
                const response = await axios.post('http://localhost:5000/api/tasks', formData);
                console.log("data has be posted");
                console.log('Created task:', response.data);

                // Add new task to the task list
                setTasks([...tasks, response.data]);
                setFormData({ title: '', description: '', startDate: '', endDate: '', priority: 'Medium' });
                setShowForm(false); // Close form
            } catch (error) {
                console.error('Error adding task:', error);
                alert("Error submitting the task. Check console for details.");
            }
        } else {
            alert('All fields are required!');
        }
    };

    const handleSoftDelete = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${id}/delete`);
            fetchTasks(); // Refresh tasks
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleCompleteTask = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${id}/complete`);
            fetchTasks(); // Refresh tasks list
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };


    return (
        <div className="task-page">
            <Sidebar />
            <SearchBar/>
            {tasks.length === 0 && (
                <div className="welcome-message">
                    <i className="bi bi-journal-text" style={{ fontSize: "50px" }}></i>
                    <br />
                    <b>Welcome to a new beginning! Your first task is the first step toward achieving great things.</b>
                    <b>Let's get started—small steps today lead to big accomplishments tomorrow!</b>
                </div>
            )}

            <div className="task-list container mt-5">
                <div className="row">
                    {tasks.map((task) => (
                        <div key={task._id} className="col-md-4 col-sm-6 col-12 mb-4">
                            <div className="card custom-card">
                                <button
                                    className="delete-btn"
                                    onClick={() => handleSoftDelete(task._id)}
                                >
                                    🗑️
                                </button>
                                <div className="card-body">
                                    <h3 className="task-title">{task.title || 'No title'}</h3>
                                    <p className="task-description">{task.description || 'No description'}</p>
                                    <div className="task-meta">
                                        <p className="task-date">
                                            Start: {new Date(task.startDate).toLocaleDateString()} <br />
                                            End: {new Date(task.endDate).toLocaleDateString()}
                                        </p>
                                        <p className={`task-priority priority-${task.priority.toLowerCase()}`}>
                                            {task.priority}
                                        </p>
                                    </div>
                                    <button
                                        className="complete-btn"
                                        onClick={() => handleCompleteTask(task._id)}
                                    >
                                        Complete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <button className="create-button" onClick={() => setShowForm(true)}>+ Create</button>

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div className="task-form-overlay">
                        <div className="task-form">
                            <h2>Create New Task</h2>
                            <label className='custom-name'>(Title)*</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Task Title"
                                value={formData.title}
                                onChange={handleInputChanges}
                                required
                            />
                            <label className='custom-name'>(Description)*</label>
                            <textarea
                                name="description"
                                placeholder="Task Description (max 50 characters)"
                                maxLength="50"
                                value={formData.description}
                                onChange={handleInputChanges}
                                required
                            />
                            <label className='custom-name'>(Start Date)*</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChanges}
                                required
                            />
                            <label className='custom-name'>(End Date)*</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChanges}
                                required
                            />
                            <label className='custom-name'>(Priority)*</label>
                            <select name="priority" value={formData.priority} onChange={handleInputChanges}>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <button className='custom-btnn' onClick={handleSubmit}>Submit</button>
                            <button className='custom-btnn' onClick={() => setShowForm(false)}>Close</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Tasks