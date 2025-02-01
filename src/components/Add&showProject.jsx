import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

// ✅ Add Project Component
const AddProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !supervisorId || !deadline) {
      alert('Please fill all fields.');
      return;
    }

    const newProject = {
      title,
      description,
      supervisor_Id: supervisorId,
      deadline
    };

    try {
      const response = await fetch('http://localhost:5091/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error('Failed to add project');
      }

      alert('Project added successfully!');
      setTitle('');
      setDescription('');
      setSupervisorId('');
      setDeadline('');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h2>Add Project</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Supervisor ID"
              value={supervisorId}
              onChange={(e) => setSupervisorId(e.target.value)}
            />
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button type="submit">Add Project</button>
          </form>
        </div>
        <Link to="/home/show-projects">View Projects</Link>
      </div>
    </div>
  );
};

// ✅ Show Project Component
const ShowProject = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5091/api/project?CurrentPage=1&PageSize=5');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();

        // Ensure projects is always an array
        setProjects(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); // Ensure projects is always an array
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h2>Show Projects</h2>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="projects-table">
            <table>
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Description</th>
                  <th>Supervisor ID</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.description}</td>
                    <td>{project.supervisor_Id}</td>
                    <td>{new Date(project.deadline).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Link to="/home/add-project">Add Project</Link>
      </div>
    </div>
  );
};

export { AddProject, ShowProject };
