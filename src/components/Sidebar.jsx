import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white p-6">
      <ul className="space-y-4">
        <li>
          <Link
            to="/"
            className="block py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/home/show-projects"
            className="block py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Show Projects
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
