// src/pages/UserDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>User Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <p>Welcome to your dashboard!</p>

      {/* Add calendar, stats, wellbeing tracker, etc here */}
    </div>
  );
};

export default UserDashboard;
