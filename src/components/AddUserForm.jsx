import { useState } from "react";
import useAppStore from "../store/useAppStore";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    Sex: "",
    DOB: "",
    RoleId: "",
  });

  const { addUser } = useAppStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.UserName) {
      alert("اسم المستخدم مطلوب");
      return false;
    }
    if (!formData.Email || !/\S+@\S+\.\S+/.test(formData.Email)) {
      alert("الرجاء إدخال بريد إلكتروني صالح");
      return false;
    }
    if (!formData.PhoneNumber) {
      alert("رقم الهاتف مطلوب");
      return false;
    }
    if (!formData.Password) {
      alert("كلمة المرور مطلوبة");
      return false;
    }
    if (!formData.RoleId) {
      alert("الدور مطلوب");
      return false;
    }
    if (!formData.Sex) {
      alert("الجنس مطلوب");
      return false;
    }
    if (!formData.DOB) {
      alert("تاريخ الميلاد مطلوب");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("بيانات النموذج:", formData);

    const formDataToSend = new FormData();
    formDataToSend.append("UserName", formData.UserName);
    formDataToSend.append("Email", formData.Email);
    formDataToSend.append("PhoneNumber", formData.PhoneNumber);
    formDataToSend.append("Password", formData.Password);
    formDataToSend.append("Sex", formData.Sex);
    formDataToSend.append("DOB", formData.DOB);
    formDataToSend.append("RoleId", formData.RoleId);

    try {
      const response = await fetch(
        "http://localhost:5091/api/account/register",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        let data = null;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
          addUser(data);
          alert("تم إضافة المستخدم بنجاح!");
        } else if (contentType && contentType.includes("text/plain")) {
          const text = await response.text();
          alert(text);
        } else {
          console.error("تنسيق الاستجابة غير متوقع:", contentType);
          alert("تنسيق الاستجابة غير متوقع. الرجاء المحاولة لاحقاً.");
        }
      } else {
        const errorText = await response.text();
        console.error("خطأ في الاستجابة:", errorText);
        alert(errorText || "فشل إضافة المستخدم");
      }
    } catch (error) {
      console.error("حدث خطأ:", error);
      alert("حدث خطأ. الرجاء المحاولة لاحقاً.");
    }
  };

  return (
    <form
      className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 space-y-4"
      onSubmit={handleSubmit}
      dir="rtl"  // إضافة خاصية الاتجاه من اليمين لليسار
    >
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        إضافة مستخدم جديد
      </h2>
      <input
        type="text"
        name="UserName"
        placeholder="اسم المستخدم"
        value={formData.UserName}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="email"
        name="Email"
        placeholder="البريد الإلكتروني"
        value={formData.Email}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="PhoneNumber"
        placeholder="رقم الهاتف"
        value={formData.PhoneNumber}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="password"
        name="Password"
        placeholder="كلمة المرور"
        value={formData.Password}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      />
      <select
        name="Sex"
        value={formData.Sex}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">اختر الجنس</option>
        <option value="male">ذكر</option>
        <option value="female">أنثى</option>
      </select>
      <input
        type="date"
        name="DOB"
        placeholder="تاريخ الميلاد"
        value={formData.DOB}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      />
      <select
        name="RoleId"
        value={formData.RoleId}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">اختر الدور</option>
        <option value="22c53b8f-4e38-4b6d-8b12-0c14af849b1e">مشرف</option>
        <option value="619e67a2-dafe-4452-8333-208cdc19b083">طالب</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
      >
        إضافة مستخدم
      </button>
    </form>
  );
};

export default AddUserForm;
