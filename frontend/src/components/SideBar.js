import React from 'react';
import { Link } from 'react-router-dom';
import './css/SideBar.css';

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h3><i class="bi bi-card-checklist"></i>  Task Manager</h3>
      </div>

      {/* Sidebar Menu */}
      <ul className="sidebar-menu list-unstyled">
        <li className="menu-item">
          <Link to="/" className="menu-link">
            <i className="bi bi-house-door"></i> Home
          </Link>
        </li>
        {/* <li className="menu-item">
          <Link to="/tasks" className="menu-link">
            <i className="bi bi-list-task"></i> All Tasks
          </Link>
        </li> */}
        <li className="menu-item">
          <Link to="/completed" className="menu-link">
            <i className="bi bi-check-circle"></i> Completed Tasks
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/important" className="menu-link">
            <i className="bi bi-star-fill"></i> Important Tasks
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/bin" className="menu-link">
            <i className="bi bi-trash"></i> Bin
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/settings" className="menu-link">
            <i className="bi bi-gear"></i> Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
