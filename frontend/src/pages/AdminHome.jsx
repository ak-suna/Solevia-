import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { LogOut } from 'lucide-react';
import AdminSidebar from "../components/AdminSidebar";

const AdminHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeUsers: 142,
    });

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            {/* LEFT SIDEBAR */}
            <AdminSidebar />

            {/* MAIN CENTER PANEL */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-start mb-8" style={{ fontFamily: "Brasika" }}>
                    <div>
                        <h1 className="text-4xl font-bold">
                            <span className="text-[#f4873e] dark:text-orange-400">Admin </span>
                            <span className="text-[#89beab] dark:text-teal-400">Dashboard</span>
                        </h1>
                        {/* <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening today.</p> */}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Brasika" }}>
                        Dashboard Content
                    </h2>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="bg-gradient-to-br from-[#f4873e] to-[#ff9e5e] text-white p-6 rounded-3xl hover:shadow-lg transition"
                        >
                            <p className="font-bold text-lg">Manage Users</p>
                        </button>

                        <button
                            onClick={() => navigate("/admin/reports")}
                            className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-3xl hover:shadow-lg transition"
                        >
                            <p className="font-bold text-lg">View Reports</p>
                        </button>

                        <button
                            onClick={() => navigate("/admin/challenges")}
                            className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-3xl hover:shadow-lg transition"
                        >
                            <p className="font-bold text-lg">Manage Challenges</p>
                        </button>

                        <button
                            onClick={() => navigate("/admin/groups")}
                            className="bg-gradient-to-br from-[#89beab] to-[#6fa893] text-white p-6 rounded-3xl hover:shadow-lg transition"
                        >
                            <p className="font-bold text-lg">Manage Groups</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Right Logout Button */}
            <div className="absolute top-6 right-6 flex items-center gap-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>

            {/* RIGHT SIDEBAR - System Health Card */}
            <div className="w-80 flex flex-col gap-5 pt-20">
                <div className="bg-[#f8ba90] rounded-[40px] p-6 h-[180px] shadow-lg flex flex-col justify-between border-2 border-[#f4873e]/20">
                    <div>
                        <h3 className="text-[#1F3B36] text-sm uppercase tracking-wide font-bold mb-3">System Health</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-white font-bold text-lg">All Systems Operational</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-[#2d6b57] text-xs">Uptime</p>
                            <p className="text-lg font-bold text-[#8b5a2b]">99.9%</p>
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-[#2d6b57] text-xs">Active</p>
                            <p className="text-lg font-bold text-[#2d6b57]">{stats.activeUsers}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;