import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import baseurl from "../api/url";
import { login } from "../slices/userSlice"; // ✅ import action

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = React.useState({
    identifier: "",
    password: ""
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${baseurl}/login`, user);

      console.log("Login response:", res.data);

      const apiData = res.data.data;

      if (apiData?.user && apiData?.token) {
        // save in localStorage
        localStorage.setItem("token", apiData.token);
        localStorage.setItem("user", JSON.stringify(apiData.user));

        // ✅ correct Redux dispatch
        dispatch(
          login({
            user: apiData.user,
            token: apiData.token
          })
        );

        alert("Login successful!");
        navigate("/profile");
      } else {
        alert("Login failed: Invalid response");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="identifier"
          placeholder="Username"
          value={user.identifier}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <Link to="/register">
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
};

export default Login;