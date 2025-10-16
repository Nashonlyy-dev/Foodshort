import React from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

const PartnerRegister = () => {
   const navigate = useNavigate()

  const handlesubmit= async  (e)=>{
    e.preventDefault();

   


    console.log(e.target.businessName.value);
    

   const res = await axios.post("https://foodshort.onrender.com/api/auth/partner/register",{
      name:e.target.businessName.value,
      email:e.target.email.value,
      password:e.target.password.value,
      contactName:e.target.contactName.value,
      phone:e.target.phone.value,
      address:e.target.address.value,
    }, { withCredentials: true }

    

)

 console.log(res);

 navigate("/foodpartner/feed")
  }
  return (
    <div className="form-page">
      <div className="auth-card">
        <div className="auth-visual">
          <h2>Partner onboarding</h2>
          <p className="muted">
            Register your business to start listing items, receive orders, and
            manage your store.
          </p>
        </div>

        <div className="auth-form">
          <form onSubmit={handlesubmit}>
            <div className="row-gap">
              <label htmlFor="businessName">Business name</label>
              <input
                id="businessName"
                name="businessName"
                className="input"
                placeholder="e.g. The Tasty Corner"
              />
            </div>

            <div className="form-row">
              <div className="row-gap input">
                <label htmlFor="contactName">Contact person</label>
                <input
                  id="contactName"
                  name="contactName"
                  className="input"
                  placeholder="Full name"
                />
              </div>

              <div className="row-gap input">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  className="input"
                  placeholder="e.g. 9012345678"
                />
              </div>
            </div>

            <div className="row-gap">
              <label htmlFor="email">Business email</label>
              <input
                id="email"
                name="email"
                className="input"
                placeholder="contact@business.com"
              />
            </div>

            <div className="row-gap">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                className="input"
                placeholder="Street, City, State"
              />
            </div>

            {/* <div className="row-gap">
              <label htmlFor="taxId">GST / Tax ID (optional)</label>
              <input
                id="taxId"
                name="taxId"
                className="input"
                placeholder="e.g. 22AAAAA0000A1Z5"
              />
            </div> */}

            <div className="form-row" style={{ marginTop: 6 }}>
              <div className="row-gap input">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input"
                  placeholder="Create password"
                />
              </div>

              {/* <div className="row-gap input">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input"
                  placeholder="Repeat password"
                />
              </div> */}
            </div>

            {/* <div className="row-gap" style={{ marginTop: 8 }}>
              <label>Business license / permit (optional)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="file" className="input" disabled />
                <div className="muted small" style={{ alignSelf: "center" }}>
                  File upload demo - connect to API
                </div>
              </div>
            </div> */}

            <div className="actions">
              <div className="muted small">
                We usually review partner applications within 1-2 business days.
              </div>
              <button  className="btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;

