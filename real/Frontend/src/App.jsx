import React from "react";
import { Routes, Route } from "react-router-dom";

// User Pages
import Home from "./Pages/Home";
import UserRegister from "./Pages/UserRegister";
import UserLogin from "./Pages/UserLogin";

// Partner Pages
import PartnerRegister from "./Pages/PartnerRegister";
import PartnerLogin from "./Pages/PartnerLogin";
import PartnerFeed from "./Pages/partner/PartnerFeed";
import FoodUpload from "./Pages/partner/FoodUpload";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* User Routes */}
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />

      {/* Partner Routes */}
      <Route path="/foodpartner/register" element={<PartnerRegister />} />
      <Route path="/foodpartner/login" element={<PartnerLogin />} />
      <Route path="/foodpartner/feed" element={<PartnerFeed />} />
      <Route path="/foodpartner/upload" element={<FoodUpload />} />
    </Routes>
  );
}

export default App;
