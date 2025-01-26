import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/add-user">Add New User</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
