import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddUserForm from "./AddUserForm";
import useAppStore from "../store/useAppStore";
import Sidebar from "./Sidebar";

const HomePage = () => {
  const { users, fetchUsers } = useAppStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">مرحبًا بك في لوحة التحكم</h2>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            إضافة مستخدم
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 border">اسم المستخدم</th>
                <th className="py-2 px-4 border">البريد الإلكتروني</th>
                <th className="py-2 px-4 border">الهاتف</th>
                <th className="py-2 px-4 border">الجنس</th>
                <th className="py-2 px-4 border">تاريخ الميلاد</th>
                <th className="py-2 px-4 border">الدور</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="odd:bg-gray-100">
                    <td className="py-2 px-4 border text-center">{user.username}</td>
                    <td className="py-2 px-4 border text-center">{user.email}</td>
                    <td className="py-2 px-4 border text-center">{user.phone}</td>
                    <td className="py-2 px-4 border text-center">{user.sex}</td>
                    <td className="py-2 px-4 border text-center">{user.dob}</td>
                    <td className="py-2 px-4 border text-center">{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">
                    جاري تحميل المستخدمين...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <AddUserForm closeModal={() => setIsModalOpen(false)} />
            <button 
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition" 
              onClick={() => setIsModalOpen(false)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;