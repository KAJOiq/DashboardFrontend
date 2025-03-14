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
      setUserRole("مشرف");
    }
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "مشرف") {
      alert("فقط المشرفون يمكنهم إضافة مشاريع.");
      return;
    }

    if (!title || !description || !supervisorId || !deadline) {
      alert("يرجى ملء جميع الحقول.");
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
        throw new Error("فشل في إضافة المشروع");
      }

      alert("تم إضافة المشروع بنجاح!");
      setTitle("");
      setDescription("");
      setSupervisorId("");
      setDeadline("");
      onClose();
    } catch (error) {
      console.error("خطأ في إضافة المشروع:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">إضافة مشروع</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="عنوان المشروع"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="وصف المشروع"
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
            <option value="">اختر المشرف</option>
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
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              إضافة المشروع
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
          throw new Error("فشل في جلب تفاصيل المشروع");
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
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  const getSupervisorUsername = (supervisorId) => {
    const supervisor = users.find((user) => user.id === supervisorId);
    return supervisor ? supervisor.username : "جاري التحميل...";
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">تفاصيل المشروع</h2>
        <div className="space-y-4">
          <p><strong>العنوان:</strong> {project.title}</p>
          <p><strong>الوصف:</strong> {project.description}</p>
          <p><strong>المشرف:</strong> {getSupervisorUsername(project.supervisor_Id)}</p>
          <p><strong>الموعد النهائي:</strong> {new Date(project.deadline).toLocaleDateString("ar-EG")}</p>
          <p><strong>تاريخ الإنشاء:</strong> {new Date(project.createdAt).toLocaleString("ar-EG")}</p>
        </div>
        <div className="mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">إغلاق</button>
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
      setUserRole("مشرف");
    } else if (roles && roles.includes("Student")) {
      setUserRole("طالب");
    }
  }, [fetchProjects, fetchUsers]);

  const getSupervisorUsername = (supervisorId) => {
    const supervisor = users.find((user) => user.id === supervisorId);
    return supervisor ? supervisor.username : "جاري التحميل...";
  };

  const handleDelete = async (id) => {
    const roles = localStorage.getItem("roles"); 
    if (!roles || !roles.includes("Supervisor")) {
      alert("فقط المشرفون يمكنهم حذف المشاريع.");
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
        throw new Error("فشل في حذف المشروع");
      }
  
      alert("تم حذف المشروع بنجاح!");
      fetchProjects(1, 10);
    } catch (error) {
      console.error("خطأ في حذف المشروع:", error);
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
    <div className="flex" dir="rtl">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold">عرض المشاريع</h2>
        {userRole === "مشرف" && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded mt-4">
            إضافة مشروع
          </button>
        )}
        {showModal && <AddProject onClose={() => setShowModal(false)} />}
        {projects.length === 0 ? (
          <p className="mt-4 text-gray-600">لا توجد مشاريع.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 border">عنوان المشروع</th>
                  <th className="py-2 px-4 border">الوصف</th>
                  <th className="py-2 px-4 border">المشرف</th>
                  <th className="py-2 px-4 border">الموعد النهائي</th>
                  <th className="py-2 px-4 border">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="odd:bg-gray-100">
                    <td className="py-2 px-4 border">{project.title}</td>
                    <td className="py-2 px-4 border">{project.description}</td>
                    <td className="py-2 px-4 border">{getSupervisorUsername(project.supervisor_Id)}</td>
                    <td className="py-2 px-4 border">{new Date(project.deadline).toLocaleDateString("ar-EG")}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => handleView(project.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
                      >
                        عرض
                      </button>
                      {userRole === "مشرف" && (
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          حذف
                        </button>
                      )}
                      {userRole === "طالب" && <VoteButton projectId={project.id} />} 
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