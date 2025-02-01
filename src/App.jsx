import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import { AddProject, ShowProject } from './components/Add&showProject';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);

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
        <Route path="/home/add-project" element={<AddProject onAdd={handleAddProject} />} />
        <Route path="/home/show-projects" element={<ShowProject projects={projects} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
