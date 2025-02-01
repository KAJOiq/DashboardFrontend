import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/home/add-project">Add New Project</Link>
        </li>
        <li>
        <Link to="/home/show-projects"> Show Projects</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
