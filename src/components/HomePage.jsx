import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import AddUserForm from './AddUserForm';
import useAppStore from '../store/useAppStore';

const HomePage = () => {
  const { users } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="sidebar">
        <Link to="/home">Dashboard</Link>
        <Link to="/home/add-project">Add New Project</Link>
        <Link to="/home/show-projects"> Show Projects</Link>
      </div>
      <div className="content">
        <Routes>
          {/* Dashboard Route */}
          <Route
            path="/"
            element={
              <div>
                <h2>Welcome to the Dashboard</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h3>Users List</h3>
                  <button onClick={() => navigate('/home/add-user')}>
                    Add User
                  </button>
                </div>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Sex</th>
                      <th>DOB</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.sex}</td>
                        <td>{user.dob}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          />
          {/* Add User Route */}
          <Route path="add-user" element={<AddUserForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;