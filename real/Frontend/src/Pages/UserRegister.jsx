import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "/src/index.css";

const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "https://foodshort.onrender.com/api/auth/user/register",
      {
        fullName: e.target.fullName.value,
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
        {/* Visual Side (optional, hidden on mobile) */}
        <div className="auth-visual">
          <h2>Create Your Account 🚀</h2>
          <p>Join us and explore all the features waiting for you.</p>
        </div>

        {/* Register Form */}
        <div className="auth-form">
          <h2 className="mb-4 text-xl font-semibold">User Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="row-gap">
              <label htmlFor="fullName">Full Name</label>
              <input
                className="input"
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Create a password"
                required
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn">
                Register
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => navigate("/user/login")}
              >
                Login Instead
              </button>

               <p className="muted mt-4 small text-blue-400"  onClick={() => navigate("/foodpartner/register")}>
              Register as Foodpartner 
            </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

