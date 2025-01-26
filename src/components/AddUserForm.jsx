import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    sex: '',
    dob: '',
    role: '',
  });

  const { roles, setRoles, addUser } = useAppStore();

  useEffect(() => {
    // Fetch roles dynamically
    const fetchRoles = async () => {
      const response = await fetch('/api/roles'); // Replace with your API endpoint
      const data = await response.json();
      setRoles(data);
    };

    fetchRoles();
  }, [setRoles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
    alert('User added successfully!');
  };

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      <h2>Add New User</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <select name="sex" value={formData.sex} onChange={handleChange}>
        <option value="">Select Sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="date"
        name="dob"
        placeholder="Date of Birth"
        value={formData.dob}
        onChange={handleChange}
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
