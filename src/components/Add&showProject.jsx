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
  const { users, fetchUsers, token } = useAppStore();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchUsers(); 
    const roles = localStorage.getItem("roles");
    if (roles && roles.includes("Supervisor")) {
      setUserRole("Supervisor");
    }
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "Supervisor") {
      alert("Only supervisors can add projects.");
      return;
    }

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
          Authorization: `Bearer ${token}`,
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

const ViewProject = ({ projectId, onClose }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { users, fetchUsers } = useAppStore();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5091/api/project/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjectDetails();
    fetchUsers();
  }, [projectId, fetchUsers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getSupervisorUsername = (supervisorId) => {
    const supervisor = users.find((user) => user.id === supervisorId);
    return supervisor ? supervisor.username : "Loading...";
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Project Details</h2>
        <div className="space-y-4">
          <p><strong>Title:</strong> {project.title}</p>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Supervisor:</strong> {getSupervisorUsername(project.supervisor_Id)}</p>
          <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString("en-GB")}</p>
          <p><strong>Created At:</strong> {new Date(project.createdAt).toLocaleString()}</p>
        </div>
        <div className="mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

const ShowProject = () => {
  const { projects, fetchProjects } = useProjectStore();
  const { users, fetchUsers } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchProjects(1, 10);
    fetchUsers();
    const roles = localStorage.getItem("roles"); 
    if (roles && roles.includes("Supervisor")) {
      setUserRole("Supervisor");
    } else if (roles && roles.includes("Student")) {
      setUserRole("Student");
    }
  }, [fetchProjects, fetchUsers]);

  const getSupervisorUsername = (supervisorId) => {
    const supervisor = users.find((user) => user.id === supervisorId);
    return supervisor ? supervisor.username : "Loading...";
  };

  const handleDelete = async (id) => {
    const roles = localStorage.getItem("roles"); 
    if (!roles || !roles.includes("Supervisor")) {
      alert("Only supervisors can delete projects.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5091/api/project/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleView = (id) => {
    setCurrentProjectId(id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setCurrentProjectId(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold">Show Projects</h2>
        {userRole === "Supervisor" && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded mt-4">
            Add Project
          </button>
        )}
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
                    <td className="py-2 px-4 border">{getSupervisorUsername(project.supervisor_Id)}</td>
                    <td className="py-2 px-4 border">{new Date(project.deadline).toLocaleDateString("en-GB")}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleView(project.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
                      >
                        View
                      </button>
                      {userRole === "Supervisor" && (
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      )}
                      {userRole === "Student" && <VoteButton projectId={project.id} />} 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showViewModal && <ViewProject projectId={currentProjectId} onClose={handleCloseViewModal} />}
    </div>
  );
};


const VoteButton = ({ projectId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [voted, setVoted] = useState(false);
  const { token } = useAppStore();

  const handleVote = async () => {
    if (!token) {
      setError("يجب تسجيل الدخول للتصويت");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5091/api/student/vote", {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error("فشل في إرسال التصويت");
      }

      setVoted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleVote}
        disabled={isSubmitting || voted}
        className="px-3 py-1 bg-green-600 text-white rounded ml-2"
      >
        {voted ? "تم التصويت" : isSubmitting ? "جاري التصويت..." : "صوت"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};



export { AddProject, ViewProject, ShowProject, VoteButton };