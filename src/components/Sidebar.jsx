import { Link } from "react-router-dom";

const Sidebar = () => {
  const roles = localStorage.getItem('roles'); 
  const userRole = roles ? roles : null;

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white p-6">
      <ul className="space-y-4">
        {userRole === 'Supervisor' && (
          <li>
            <Link
              to="/home"
              className="block py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              لوحة التحكم
            </Link>
          </li>
        )}

        {(userRole === 'Student' || userRole === 'Supervisor') && (
          <li>
            <Link
              to="/home/show-projects"
              className="block py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              المشاريع
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
