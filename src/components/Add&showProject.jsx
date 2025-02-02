import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import useProjectStore from "../store/projectAppStore";
import useAppStore from "../store/useAppStore";

const AddProject = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [deadline, setDeadline] = useState("");
  const { users, fetchUsers } = useAppStore();

  useEffect(() => {
    fetchUsers(); // Fetch users when component mounts
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !supervisorId || !deadline) {
      alert("Please fill all fields.");
      return;
    }

    const formattedDeadline = new Date(deadline).toISOString().split("T")[0];

    const newProject = {
      title,
      description,
      supervisor_Id: supervisorId,
      deadline: formattedDeadline,
    };

    try {
      const response = await fetch("http://localhost:5091/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      alert("Project added successfully!");
      setTitle("");
      setDescription("");
      setSupervisorId("");
      setDeadline("");
      onClose();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            name="Supervisor"
            value={supervisorId}
            onChange={(e) => setSupervisorId(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Supervisor</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ShowProject = () => {
  const { projects, fetchProjects } = useProjectStore();
  const [showModal, setShowModal] = useState(false);
  const { users, fetchUsers } = useAppStore();

  useEffect(() => {
    fetchProjects(1, 10);
    fetchUsers();
  }, [fetchProjects, fetchUsers]);

  const getSupervisorUsername = (supervisorId) => {
    const supervisor = users.find((user) => user.id === supervisorId);
    return supervisor ? supervisor.username : "Loading...";
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5091/api/project/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      alert("Project deleted successfully!");
      fetchProjects(1, 10);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold">Show Projects</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded mt-4">Add Project</button>
        {showModal && <AddProject onClose={() => setShowModal(false)} />}
        {projects.length === 0 ? (
          <p className="mt-4 text-gray-600">No projects found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 border">Project Title</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Supervisor</th>
                  <th className="py-2 px-4 border">Deadline</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="odd:bg-gray-100">
                    <td className="py-2 px-4 border">{project.title}</td>
                    <td className="py-2 px-4 border">{project.description}</td>
                    <td className="py-2 px-4 border">
                      {getSupervisorUsername(project.supervisor_Id)}
                    </td>
                    <td className="py-2 px-4 border">{new Date(project.deadline).toLocaleDateString("en-GB")}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
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
      </div>
    </div>
  );
};

export { AddProject, ShowProject };
