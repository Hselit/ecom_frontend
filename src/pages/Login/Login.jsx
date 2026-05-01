import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { login as loginUser } from "../../api/services/authApi";
import { login } from "../../slices/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = React.useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(user);
      const apiData = res.data?.data;

      if (apiData?.user && apiData?.token) {
        localStorage.setItem("token", apiData.token);
        localStorage.setItem("user", JSON.stringify(apiData.user));

        dispatch(
          login({
            user: apiData.user,
            token: apiData.token,
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

        <Link to="/register">Don&apos;t have an account? Register</Link>
      </form>
    </div>
  );
};

export default Login;
