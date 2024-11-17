import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SideBar';
import './css/Tasks.css';
import SearchBar from './SearchBar';

const ImportantTasksPage = () => {
  const [importantTasks, setImportantTasks] = useState([]);

  useEffect(() => {
    fetchImportantTasks();
  }, []);

  const fetchImportantTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/important');
      setImportantTasks(response.data);
    } catch (error) {
      console.error('Error fetching important tasks:', error);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/complete`);
      fetchImportantTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/delete`);
      fetchImportantTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-page">
      <Sidebar />
      <SearchBar />
      <div className="important-tasks">
        {/* Conditionally render if there are no tasks */}
        {importantTasks.length === 0 ? (
          <div className="empty-tasks-message" style={{"marginTop":"100px"}}>
            <h3>No important tasks to show.!!</h3>
          </div>
        ) : (
          <div className="task-list container mt-5">
            <div className="row">
              {importantTasks.map((task) => (
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
                      {/* Complete and Delete buttons */}
                      <div className="task-actions">
                        <button className="complete-btn" onClick={() => handleCompleteTask(task._id)}>
                          Complete
                        </button>
                        <button className="delete-btn" onClick={() => handleSoftDelete(task._id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportantTasksPage;
