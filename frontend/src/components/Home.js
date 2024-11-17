import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './SideBar';
import SearchBar from './SearchBar';
import './css/Home.css';

const Home = () => {
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    importantTasks: 0,
    overdueTasks: 0,
    upcomingTasks: 0,
    priorityDistribution: [],
  });

  // Fetch task statistics from the backend
  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/task-stats');
        console.log('Fetched Task Stats:', response.data); // Log data to see if it contains priorityDistribution
        setTaskStats(response.data);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      }
    };
    fetchTaskStats();
  }, []);


  return (
    <>
      <Sidebar />
      <SearchBar />
      <div className="container">
        {/* <h2 className="mb-4 text-center">Dashboard</h2> */}

        {/* Dashboard Cards Row */}
        <div className="row custom-row">
          {/* Total Tasks Card */}
          <div className="col">
            <div className="card custom-cards">
              <div className="card-body">
                <h5>Total Tasks</h5>
                <p className="custom-number">{taskStats.totalTasks}</p>
              </div>
            </div>
          </div>

          {/* Active Tasks Card */}
          <div className="col">
            <div className="card custom-cards">
              <div className="card-body">
                <h5>Active Tasks</h5>
                <p className="custom-number">{taskStats.activeTasks}</p>
              </div>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="col">
            <div className="card custom-cards">
              <div className="card-body">
                <h5>Completed Tasks</h5>
                <p className="custom-number">{taskStats.completedTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row of Cards */}
        <div className="row custom-row">
          {/* Important Tasks Card */}
          <div className="col">
            <div className="card custom-cards">
              <div className="card-body">
                <h5>Important Tasks</h5>
                <p className="custom-number">{taskStats.importantTasks}</p>
              </div>
            </div>
          </div>

          {/* Overdue Tasks Card */}
          <div className="col">
            <div className="card custom-cards">
              <div className="card-body">
                <h5>Overdue Tasks</h5>
                <p className="custom-number">{taskStats.overdueTasks}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks Card */}
          <div className="col">
            <div className="card custom-cards">
              <div className="card-body">
                <h5>Upcoming Tasks</h5>
                <p className="custom-number">{taskStats.upcomingTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution Card */}
        <div className="row custom-row1">
          <div className="col">
            <div className="card custom-card1">
              <div className="card-body">
                <h5>Task Distribution by Priority</h5>
                <ul style={{
                  listStyleType: 'none',
                  paddingLeft: 30,
                  display: 'flex',
                  justifyContent: 'center',
                  "fontSize":20
                }}>
                  {taskStats.priorityDistribution && taskStats.priorityDistribution.length > 0 ? (
                    ['High', 'Medium', 'Low'].map((priorityLabel) => {
                      const priorityItem = taskStats.priorityDistribution.find(item => item.priority === priorityLabel);
                      const count = priorityItem ? priorityItem.count : 0;

                      return (
                        <li key={priorityLabel} style={{ marginRight: '20px' }}>
                          <strong>{priorityLabel}</strong>: {count}
                        </li>
                      );
                    })
                  ) : (
                    <li>No priority data available</li>
                  )}
                </ul>
              


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
