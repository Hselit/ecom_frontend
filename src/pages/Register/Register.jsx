import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { getRoles, registerUser } from "../../api/services/userApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phoneNumber: "",
    profile: "",
    gender: "",
    roleId: "",
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles({ limit: 10, offset: 0 });
        const activeRoles = (res.data?.data || []).filter((r) => r.isActive);
        setRoles(activeRoles);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "roleId" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(formData);

      if (res.data.success) {
        alert("Registration successful! Please login.");
      } else {
        alert("Registration failed: " + res.data.message);
        return;
      }
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleInputChange} />

        <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />

        <input type="text" name="profile" placeholder="Profile Image URL" onChange={handleInputChange} />

        <select name="gender" onChange={handleInputChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} />

        <select name="roleId" onChange={handleInputChange}>
          <option value="">Select Role</option>

          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.roleName}
            </option>
          ))}
        </select>

        <button type="submit">Register</button>

        <Link to="/login" className="login-link">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
};

export default Register;
