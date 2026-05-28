// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getToken, logout } from "../services/auth";
// import { Users, AlertTriangle, Trophy, UserPlus, LogOut } from 'lucide-react';
// import AdminReportsPage from "./AdminReportsPage";
// import AdminChallengesPage from "./AdminChallengesPage";
// import AdminGroupsPage from "./AdminGroupsPage";
// import DataTable from "../components/DataTable";

// const AdminDashboard = () => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState("users");
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (activeTab === "users") {
//             fetchUsers();
//         }
//     }, [activeTab]);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch("http://localhost:5000/api/admin/users", {
//                 headers: { Authorization: `Bearer ${getToken()}` },
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.error);
//             setUsers(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleUserStatus = async (userId, currentStatus) => {
//         const action = currentStatus ? "enable" : "disable";
//         if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

//         try {
//             const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getToken()}`,
//                 },
//                 body: JSON.stringify({ disabled: !currentStatus }),
//             });

//             if (!response.ok) throw new Error(`Failed to ${action} user`);
//             fetchUsers();
//             alert(`User ${action}d successfully`);
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const changeRole = async (userId, newRole) => {
//         try {
//             const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getToken()}`,
//                 },
//                 body: JSON.stringify({ role: newRole }),
//             });

//             if (!response.ok) throw new Error("Failed to update role");
//             fetchUsers();
//             alert("Role updated successfully");
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };

//     const tabs = [
//         { id: "users", label: "Users", icon: Users, color: "from-[#f4873e] to-[#ff9e5e]" },
//         { id: "reports", label: "Reports", icon: AlertTriangle, color: "from-red-500 to-red-600" },
//         { id: "challenges", label: "Challenges", icon: Trophy, color: "from-yellow-500 to-yellow-600" },
//         { id: "groups", label: "Groups", icon: UserPlus, color: "from-[#89beab] to-[#6fa893]" }
//     ];

//     // ✅ DataTable Column Definitions
//     const userColumns = [
//         {
//             key: 'name',
//             label: 'Name',
//             sortable: true,
//             accessor: (row) => `${row.firstName} ${row.lastName}`,
//             render: (value, row) => (
//                 <span className="text-gray-900 dark:text-white font-medium">{value}</span>
//             )
//         },
//         {
//             key: 'email',
//             label: 'Email',
//             sortable: true,
//             render: (value) => (
//                 <span className="text-gray-600 dark:text-gray-400">{value}</span>
//             )
//         },
//         {
//             key: 'role',
//             label: 'Role',
//             sortable: true,
//             render: (value, row) => (
//                 <select
//                     value={value}
//                     onChange={(e) => {
//                         e.stopPropagation();
//                         changeRole(row._id, e.target.value);
//                     }}
//                     disabled={row.disabled}
//                     className="px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#f4873e] disabled:opacity-50 cursor-pointer"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <option value="user">User</option>
//                     <option value="admin">Admin</option>
//                 </select>
//             )
//         },
//         {
//             key: 'disabled',
//             label: 'Status',
//             sortable: true,
//             render: (value) => (
//                 <span className={`
//                     px-4 py-2 rounded-full text-sm font-bold inline-block
//                     ${value
//                         ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
//                         : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
//                     }
//                 `}>
//                     {value ? "🔴 Disabled" : "🟢 Active"}
//                 </span>
//             )
//         },
//         {
//             key: 'isVerified',
//             label: 'Verified',
//             sortable: true,
//             render: (value) => (
//                 <span className="text-2xl">{value ? "✅" : "❌"}</span>
//             )
//         },
//         {
//             key: 'phone',
//             label: 'Phone',
//             render: (value) => (
//                 <span className="text-gray-600 dark:text-gray-400">{value || "N/A"}</span>
//             )
//         },
//         {
//             key: 'actions',
//             label: 'Actions',
//             render: (value, row) => (
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         toggleUserStatus(row._id, row.disabled);
//                     }}
//                     className={`
//                         px-5 py-2 rounded-full font-bold text-white transition-all hover:shadow-lg
//                         ${row.disabled
//                             ? 'bg-gradient-to-r from-green-500 to-green-600'
//                             : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
//                         }
//                     `}
//                 >
//                     {row.disabled ? "✅ Enable" : "🚫 Disable"}
//                 </button>
//             )
//         }
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
//             {/* Header */}
//             <div className="max-w-7xl mx-auto mb-6">
//                 <div className="bg-white dark:bg-gray-800 rounded-[40px] p-6 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-700">
//                     <div className="flex justify-between items-center">
//                         <h1 className="text-3xl font-bold" style={{ fontFamily: "Brasika" }}>
//                             <span className="text-[#f4873e] dark:text-orange-400">Admin </span>
//                             <span className="text-[#89beab] dark:text-teal-400">Dashboard</span>
//                         </h1>
//                         <button
//                             onClick={handleLogout}
//                             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
//                         >
//                             <LogOut className="w-5 h-5" />
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Navigation Tabs */}
//             <div className="max-w-7xl mx-auto mb-6">
//                 <div className="bg-white dark:bg-gray-800 rounded-[40px] p-4 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-700">
//                     <div className="grid grid-cols-4 gap-4">
//                         {tabs.map((tab) => {
//                             const Icon = tab.icon;
//                             const isActive = activeTab === tab.id;
//                             return (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`
//                                         relative overflow-hidden rounded-3xl p-6 transition-all duration-300
//                                         ${isActive
//                                             ? `bg-gradient-to-br ${tab.color} text-white shadow-lg scale-105`
//                                             : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-102 hover:shadow-md'
//                                         }
//                                     `}
//                                 >
//                                     <div className="flex flex-col items-center gap-3">
//                                         <Icon className="w-8 h-8" />
//                                         <span className="font-bold text-lg">{tab.label}</span>
//                                     </div>
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>

//             {/* Content Area */}
//             <div className="max-w-7xl mx-auto">
//                 <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-700 min-h-[600px]">

//                     {/* USER MANAGEMENT TAB - Now using DataTable */}
//                     {activeTab === "users" && (
//                         <div>
//                             <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
//                                 <Users className="w-7 h-7 text-[#f4873e]" />
//                                 User Management
//                             </h2>

//                             {error ? (
//                                 <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
//                                     <p className="text-red-600 dark:text-red-400">Error: {error}</p>
//                                 </div>
//                             ) : (
//                                 <DataTable
//                                     columns={userColumns}
//                                     data={users}
//                                     loading={loading}
//                                     searchable={true}
//                                     searchPlaceholder="Search users by name, email..."
//                                     itemsPerPage={10}
//                                     emptyMessage="No users found"
//                                 />
//                             )}
//                         </div>
//                     )}

//                     {/* OTHER TABS */}
//                     {activeTab === "reports" && <AdminReportsPage />}
//                     {activeTab === "challenges" && <AdminChallengesPage />}
//                     {activeTab === "groups" && <AdminGroupsPage />}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;