import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
            <h1>Dashboard</h1>
            <p>Welcome! You are logged in.</p>
            <button
                onClick={handleLogout}
                style={{
                    padding: "10px 20px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;