import React from 'react';
import axios from 'axios';
import { useState,useEffect } from 'react';
import Sidebar from './SideBar';
import "./css/Tasks.css"


const Tasks = () => {

    const[tasks, setTasks] = useState([]);
    const[showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate:'',
        endDate:'',
        priority: 'Medium',
    });

    useEffect(()=>{
        fetchTasks();
    },[]);

    const fetchTasks = async()=>{
        try{
            const response = await axios.get('http://localhost:5000/tasks');
            setTasks(response.data);
        }
        catch(error){
            console.error('Error fetching tasks:', error);
        }
    };

    const handleInputChanges = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async () => {
        const { title, description, startDate, endDate, priority } = formData;
        if (title && description && startDate && endDate && priority) {
            try {
                const response = await axios.post('http://localhost:5000/tasks', formData);
                setTasks([...tasks, response.data]);
                setFormData({ title: '', description: '', startDate: '', endDate: '', priority: 'Medium' });
                setShowForm(false);
            } catch (error) {
                console.error('Error adding task:', error);
            }
        } else {
            alert('All fields are required!');
        }
    };

    const handleDeleteTask = async(id) => {
        try{
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks(tasks.filter((task) => task._id !== id));
        }catch (error){
            console.error('Error deleting task:', error);
        }
    };

    return (
        <> 
           
            <div className="task-page">
                <Sidebar/>
                {tasks.length === 0 && <div className="welcome-message">
                <i class="bi bi-journal-text" style={{"fontSize":"50px"}}></i>
                <br></br>
                <b>Welcome to a new beginning! Your first task is the first step toward achieving great things.</b>
                <b>Let's get started—small steps today lead to big accomplishments tomorrow! </b></div>}
                <div className="task-list">
                    {tasks.map((task) => (
                        <div key={task._id} className="task-card">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Start: {new Date(task.startDate).toLocaleDateString()}</p>
                            <p>End: {new Date(task.endDate).toLocaleDateString()}</p>
                            <p>Priority: {task.priority}</p>
                            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                        </div>
                    ))}
                </div>

                <button className="create-button" onClick={() => setShowForm(true)}>+ Create</button>

                {showForm && (
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
                )}
            </div>
        </>
          
   
  )
}

export default Tasks