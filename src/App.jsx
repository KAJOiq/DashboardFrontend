import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        
        {/* Conditionally render routes based on userRole */}
        {isAuthenticated && userRole === 'Supervisor' && (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/home/show-projects" element={<ShowProject projects={projects} />} />
            <Route path="/home/add-project" element={<AddProject onAdd={handleAddProject} />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
        
        {isAuthenticated && userRole === 'Student' && (
          <>
            <Route path="/home/show-projects" element={<ShowProject projects={projects} />} />
            <Route path="*" element={<Navigate to="/home/show-projects" replace />} />
          </>
        )}

        {/* If not authenticated, redirect to login */}
        {!isAuthenticated && <Route path="*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </Router>
  );
}

export default App;
