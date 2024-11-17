import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import "./css/SearchBar.css";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);
    const navigate = useNavigate(); // Replace useHistory with useNavigate

    // Fetch all tasks when the component mounts
    useEffect(() => {
        if (searchTerm) {
            // Fetch tasks based on the search term
            fetchTasks(searchTerm);
        } else {
            setFilteredTasks([]); // Clear the list when search term is empty
        }
    }, [searchTerm]);

    // Function to fetch tasks that match the search term
    const fetchTasks = async (term) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tasks/search?name=${term}`);
            setFilteredTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle task click (redirect to task detail page)
    const handleTaskSelect = (taskId) => {
        navigate(`/task/${taskId}`); // Redirect to the task detail page using navigate
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search tasks..."
            />
            {filteredTasks.length > 0 && (
                <ul className="search-dropdown">
                    {filteredTasks.map((task) => (
                        <li
                            key={task._id}
                            onClick={() => handleTaskSelect(task._id)}
                            className="dropdown-item"
                        >
                            {task.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
