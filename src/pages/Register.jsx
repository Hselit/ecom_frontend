import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import baseUrl from "../api/url";

const Register = () => {
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phoneNumber: "",
    profile: "",
    gender: "",
    roleId: ""
  });

  // roles state
  const [roles, setRoles] = useState([]);

  // fetch roles once
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/role/?limit=10&offset=0`
        );

        // filter active roles (optional but good)
        const activeRoles = res.data.data.filter((r) => r.isActive);

        setRoles(activeRoles);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "roleId" ? Number(value) : value
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${baseUrl}/user/register`,
        formData
      );

      if (res.data.success) {
        alert("Registration successful! Please login.");
      } else {
        alert("Registration failed: " + res.data.message);
        return;
      }
      // redirect to login after success
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
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleInputChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="profile"
          placeholder="Profile Image URL"
          onChange={handleInputChange}
        />

        <select name="gender" onChange={handleInputChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleInputChange}
        />

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