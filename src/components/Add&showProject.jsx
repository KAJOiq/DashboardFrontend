import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import useProjectStore from '../store/projectAppStore';

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

    const formattedDeadline = new Date(deadline).toISOString().split('T')[0];

    const newProject = {
      title,
      description,
      supervisor_Id: supervisorId,
      deadline: formattedDeadline,
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
              type="date"
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

const ShowProject = () => {
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects(1, 10);
  }, [fetchProjects]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5091/api/project/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      alert('Project deleted successfully!');
      // Refresh the project list after deletion
      fetchProjects(1, 10);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

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
                  <th>Actions</th> {/* Add a column for actions */}
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.description}</td>
                    <td>{project.supervisor_Id}</td>
                    <td>{new Date(project.deadline).toLocaleDateString('en-GB')}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(project.id)}
                        style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
                      >
                        Delete
                      </button>
                    </td>
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
