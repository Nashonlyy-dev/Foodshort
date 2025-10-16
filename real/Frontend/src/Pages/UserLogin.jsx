import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import "/src/index.css";

const UserLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3000/api/auth/user/login",
      {
        email: e.target.email.value,
        password: e.target.password.value,
      },
      { withCredentials: true }
    );

    navigate("/");
  };

  return (
    <div className="form-page">
      <div className="auth-card">
        {/* Visual / Left Side (optional for login page) */}
        <div className="auth-visual">
          <h2>Welcome Back 👋</h2>
          <p>Please log in to continue</p>
        </div>

        {/* Login Form */}
        <div className="auth-form">
          <h2 className="mb-4 text-xl font-semibold">User Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="row-gap">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="row-gap">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn">
                Login
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => navigate("/user/register")}
              >
                Register
              </button>
            </div>

            <p className="muted mt-4 small text-blue-400"  onClick={() => navigate("/foodpartner/login")}>
              Login as Foodpartner 
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
