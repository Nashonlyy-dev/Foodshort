import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const PartnerLogin = () => {

  const navigate = useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(e.target.email.value);
    
    await axios.post("http://localhost:3000/api/auth/partner/login", {
      email: e.target.email.value,
      password: e.target.password.value,
    }, { withCredentials: true });

    navigate("/foodpartner/feed")
  };
  return (
    <div className="form-page">
      <div className="auth-card">
        <div className="auth-visual">
          <h2>Partner sign in</h2>
          <p className="muted">
            Access your partner dashboard to manage menu items and orders.
          </p>
        </div>

        <div className="auth-form">
          <form onSubmit={submitHandler}>
            <div className="row-gap">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                className="input"
                placeholder="you@business.com"
              />
            </div>

            <div className="row-gap">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="Your password"
              />
            </div>

            <div className="actions">
              <div className="muted small">
                Need help? Contact support@demo.com
              </div>
              <button className="btn" type="submit">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
