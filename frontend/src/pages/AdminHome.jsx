// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getToken, logout } from "../services/auth";
// import { Users, AlertTriangle, Trophy, UserPlus, LogOut, Menu, TrendingUp, Activity } from 'lucide-react';
// import AdminSidebar from "../components/AdminSidebar";

// const AdminHome = () => {
//     const navigate = useNavigate();
//     const [stats, setStats] = useState({
//         totalUsers: 0,
//         activeUsers: 0,
//         totalGroups: 0,
//         totalChallenges: 0,
//         pendingReports: 0,
//         recentActivity: []
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchDashboardStats();
//     }, []);

//     const fetchDashboardStats = async () => {
//         setLoading(true);
//         try {
//             // TODO: Create an endpoint for dashboard stats
//             // For now, using mock data
//             setStats({
//                 totalUsers: 156,
//                 activeUsers: 142,
//                 totalGroups: 12,
//                 totalChallenges: 8,
//                 pendingReports: 3,
//                 recentActivity: [
//                     { action: "New user registered", time: "5 mins ago" },
//                     { action: "Challenge completed", time: "15 mins ago" },
//                     { action: "Report submitted", time: "1 hour ago" }
//                 ]
//             });
//         } catch (err) {
//             console.error("Error fetching stats:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };

//     const quickActions = [
//         {
//             label: "Manage Users",
//             icon: Users,
//             color: "from-[#f4873e] to-[#ff9e5e]",
//             path: "/admin/users"
//         },
//         {
//             label: "View Reports",
//             icon: AlertTriangle,
//             color: "from-red-500 to-red-600",
//             path: "/admin/reports",
//             badge: stats.pendingReports > 0 ? stats.pendingReports : null
//         },
//         {
//             label: "Manage Challenges",
//             icon: Trophy,
//             color: "from-yellow-500 to-yellow-600",
//             path: "/admin/challenges"
//         },
//         {
//             label: "Manage Groups",
//             icon: UserPlus,
//             color: "from-[#89beab] to-[#6fa893]",
//             path: "/admin/groups"
//         }
//     ];

//     const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
//         <div className={`bg-gradient-to-br ${color} rounded-[40px] p-6 h-[180px] shadow-lg flex flex-col justify-between border-2 border-white/20`}>
//             <div className="flex items-start justify-between">
//                 <div>
//                     <p className="text-white/80 text-sm uppercase tracking-wide font-bold">{title}</p>
//                     <p className="text-4xl font-bold text-white mt-2">{value}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                     <Icon className="w-6 h-6 text-white" />
//                 </div>
//             </div>
//             {subtitle && (
//                 <p className="text-white/90 text-sm font-medium">{subtitle}</p>
//             )}
//         </div>
//     );

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
//             {/* LEFT SIDEBAR */}
//             <AdminSidebar />

//             {/* MAIN CENTER PANEL */}
//             <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-8" style={{ fontFamily: "Brasika" }}>
//                     <div>
//                         <h1 className="text-3xl font-bold">
//                             <span className="text-[#f4873e] dark:text-orange-400">Admin </span>
//                             <span className="text-[#89beab] dark:text-teal-400">Dashboard</span>
//                         </h1>
//                         <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening today.</p>
//                     </div>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <StatCard
//                         title="Total Users"
//                         value={stats.totalUsers}
//                         subtitle={`${stats.activeUsers} active users`}
//                         icon={Users}
//                         color="from-[#f4873e] to-[#ff9e5e]"
//                     />
//                     <StatCard
//                         title="Total Groups"
//                         value={stats.totalGroups}
//                         subtitle="Support groups active"
//                         icon={UserPlus}
//                         color="from-[#89beab] to-[#6fa893]"
//                     />
//                     <StatCard
//                         title="Challenges"
//                         value={stats.totalChallenges}
//                         subtitle="Active challenges"
//                         icon={Trophy}
//                         color="from-yellow-500 to-yellow-600"
//                     />
//                     <StatCard
//                         title="Pending Reports"
//                         value={stats.pendingReports}
//                         subtitle="Requires attention"
//                         icon={AlertTriangle}
//                         color="from-red-500 to-red-600"
//                     />
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="mb-8">
//                     <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "Brasika" }}>
//                         Quick Actions
//                     </h2>
//                     <div className="grid grid-cols-2 gap-4">
//                         {quickActions.map((action, index) => {
//                             const Icon = action.icon;
//                             return (
//                                 <button
//                                     key={index}
//                                     onClick={() => navigate(action.path)}
//                                     className={`relative bg-gradient-to-br ${action.color} text-white rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center gap-4">
//                                             <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                                                 <Icon className="w-6 h-6" />
//                                             </div>
//                                             <span className="font-bold text-lg">{action.label}</span>
//                                         </div>
//                                         {action.badge && (
//                                             <span className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
//                                                 {action.badge}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Recent Activity */}
//                 <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//                     <div className="flex items-center gap-2 mb-4">
//                         <Activity className="w-5 h-5 text-[#f4873e]" />
//                         <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                             Recent Activity
//                         </h2>
//                     </div>
//                     <div className="space-y-3">
//                         {stats.recentActivity.map((activity, index) => (
//                             <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-600 rounded-2xl">
//                                 <p className="text-gray-700 dark:text-gray-300">{activity.action}</p>
//                                 <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Top Right Buttons */}
//             <div className="absolute top-6 right-6 flex items-center gap-6">
//                 {/* <button
//                     onClick={() => navigate('/settings')}
//                     className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
//                 >
//                     <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
//                 </button> */}
//                 <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                 >
//                     <LogOut className="w-6 h-6" />
//                     {/* <span className="font-bold"></span> */}
//                 </button>
//             </div>

//             {/* RIGHT SIDEBAR - Summary Cards */}
//             <div className="w-80 flex flex-col gap-5 pt-20">
//                 {/* System Health Card */}
//                 <div className="bg-[#f8ba90] rounded-[40px] p-6 h-[180px] shadow-lg flex flex-col justify-between border-2 border-[#f4873e]/20">
//                     <div>
//                         <h3 className="text-[#1F3B36] text-sm uppercase tracking-wide font-bold mb-3">System Health</h3>
//                         <div className="flex items-center gap-3">
//                             <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
//                             <span className="text-white font-bold text-lg">All Systems Operational</span>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
//                             <p className="text-[#2d6b57] text-xs">Uptime</p>
//                             <p className="text-lg font-bold text-[#8b5a2b]">99.9%</p>
//                         </div>
//                         <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
//                             <p className="text-[#2d6b57] text-xs">Active</p>
//                             <p className="text-lg font-bold text-[#2d6b57]">{stats.activeUsers}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminHome;
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