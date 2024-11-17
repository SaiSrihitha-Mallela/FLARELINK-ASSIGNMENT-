import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SideBar';
import SearchBar from './SearchBar';
import "./css/CompletedTask.css";

const CompletedTask = () => {
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        fetchCompletedTasks();
    }, []);

    const fetchCompletedTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks/completed');
            setCompletedTasks(response.data);
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
        }
    };

    const handleSoftDelete = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${id}/delete`);
            fetchCompletedTasks(); // Refresh tasks
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div>
            <Sidebar />
            <SearchBar />
            <div className="task-list container mt-5">
                {/* Conditionally render when there are no completed tasks */}
                {completedTasks.length === 0 ? (
                    <div className="empty-tasks-message">
                        <h3>No completed tasks!!</h3>
                    </div>
                ) : (
                    <div className="row">
                        {completedTasks.map((task) => (
                            <div key={task._id} className="col-md-4 col-sm-6 col-12 mb-4">
                                <div className="card custom-card">
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
                                        {/* Soft Delete button (bin icon) */}
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleSoftDelete(task._id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompletedTask;
