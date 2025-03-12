import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import { AddProject, ShowProject } from './components/Add&showProject';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const roles = localStorage.getItem('roles'); 

      setUserRole(roles); 

  }, []);

  const handleAddProject = (project) => {
    setProjects([...projects, project]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />}
        />
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/home/*" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route
          path="/home/show-projects"
          element={isAuthenticated ? <ShowProject projects={projects} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/home/add-project"
          element={isAuthenticated && userRole === 'Supervisor' ? <AddProject onAdd={handleAddProject} /> : <Navigate to="/home" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;