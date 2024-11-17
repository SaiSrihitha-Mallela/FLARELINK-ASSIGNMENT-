import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SideBar';
import SearchBar from './SearchBar';
import "./css/BinPage.css";

const BinPage = () => {
    const [deletedTasks, setDeletedTasks] = useState([]);

    useEffect(() => {
        fetchDeletedTasks();
    }, []);

    const fetchDeletedTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks/deleted');
            setDeletedTasks(response.data);
        } catch (error) {
            console.error('Error fetching deleted tasks:', error);
        }
    };

    const handlePermanentDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            fetchDeletedTasks(); // Refresh tasks
        } catch (error) {
            console.error('Error permanently deleting task:', error);
        }
    };

    return (
        <div className="bin-page">
            <Sidebar />
            <SearchBar />
            <div className="task-list container mt-5">
                {/* Conditionally render 'Bin is empty' message */}
                {deletedTasks.length === 0 ? (
                    <div className="empty-bin-message">
                        <h3>🗑️ Oopss!! Bin is empty</h3>
                    </div>
                ) : (
                    <div className="row">
                        {deletedTasks.map((task) => (
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
                                        </div>
                                        {/* Permanently Delete button */}
                                        <button
                                            className="delete-btnn"
                                            onClick={() => handlePermanentDelete(task._id)}
                                        >
                                            Permanently Delete
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

export default BinPage;
