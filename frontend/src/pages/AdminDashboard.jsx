// // import React, { useState, useEffect } from "react";
// // import { getToken, logout } from "../services/auth"; // make sure logout exists
// // import { useNavigate } from "react-router-dom";

// // const AdminUsers = () => {
// //     const [users, setUsers] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState("");
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         fetchUsers();
// //     }, []);

// //     const fetchUsers = async () => {
// //         try {
// //             const response = await fetch("http://localhost:5000/api/admin/users", {
// //                 headers: {
// //                     Authorization: `Bearer ${getToken()}`,
// //                 },
// //             });
// //             const data = await response.json();

// //             if (!response.ok) throw new Error(data.error);

// //             setUsers(data);
// //         } catch (err) {
// //             setError(err.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const deleteUser = async (userId) => {
// //         if (!window.confirm("Are you sure you want to delete this user?")) return;

// //         try {
// //             const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
// //                 method: "DELETE",
// //                 headers: {
// //                     Authorization: `Bearer ${getToken()}`,
// //                 },
// //             });

// //             if (!response.ok) throw new Error("Failed to delete user");

// //             fetchUsers();
// //             alert("User deleted successfully");
// //         } catch (err) {
// //             alert(err.message);
// //         }
// //     };

// //     const changeRole = async (userId, newRole) => {
// //         try {
// //             const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
// //                 method: "PATCH",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${getToken()}`,
// //                 },
// //                 body: JSON.stringify({ role: newRole }),
// //             });

// //             if (!response.ok) throw new Error("Failed to update role");

// //             fetchUsers();
// //             alert("Role updated successfully");
// //         } catch (err) {
// //             alert(err.message);
// //         }
// //     };

// //     const handleLogout = () => {
// //         logout();        // clears token
// //         navigate("/login"); // redirect to login page
// //     };

// //     if (loading) return <div>Loading users...</div>;
// //     if (error) return <div>Error: {error}</div>;

// //     return (
// //         <div style={styles.container}>
// //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //                 <h2>👥 User Management</h2>
// //                 <button onClick={handleLogout} style={styles.logoutBtn}>
// //                     🚪 Logout
// //                 </button>
// //             </div>

// //             <table style={styles.table}>
// //                 <thead>
// //                     <tr>
// //                         <th>Name</th>
// //                         <th>Email</th>
// //                         <th>Role</th>
// //                         <th>Verified</th>
// //                         <th>Phone</th>
// //                         <th>Actions</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {users.map((user) => (
// //                         <tr key={user._id}>
// //                             <td>{user.firstName} {user.lastName}</td>
// //                             <td>{user.email}</td>
// //                             <td>
// //                                 <select
// //                                     value={user.role}
// //                                     onChange={(e) => changeRole(user._id, e.target.value)}
// //                                     style={styles.select}
// //                                 >
// //                                     <option value="user">User</option>
// //                                     <option value="admin">Admin</option>
// //                                 </select>
// //                             </td>
// //                             <td>{user.isVerified ? "✅" : "❌"}</td>
// //                             <td>{user.phone || "N/A"}</td>
// //                             <td>
// //                                 <button
// //                                     onClick={() => deleteUser(user._id)}
// //                                     style={styles.deleteBtn}
// //                                 >
// //                                     🗑️ Delete
// //                                 </button>
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>
// //         </div>
// //     );
// // };

// // const styles = {
// //     container: {
// //         padding: "20px",
// //         maxWidth: "1200px",
// //         margin: "0 auto",
// //     },
// //     table: {
// //         width: "100%",
// //         borderCollapse: "collapse",
// //         backgroundColor: "white",
// //         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
// //     },
// //     select: {
// //         padding: "5px",
// //         borderRadius: "4px",
// //         border: "1px solid #ddd",
// //     },
// //     deleteBtn: {
// //         padding: "5px 10px",
// //         backgroundColor: "#dc3545",
// //         color: "white",
// //         border: "none",
// //         borderRadius: "4px",
// //         cursor: "pointer",
// //     },
// //     logoutBtn: {
// //         padding: "5px 15px",
// //         backgroundColor: "#007bff",
// //         color: "white",
// //         border: "none",
// //         borderRadius: "4px",
// //         cursor: "pointer",
// //     },
// // };

// // export default AdminUsers;
// // import React, { useState, useEffect } from "react";
// // import { getToken, logout } from "../services/auth";
// // import { useNavigate } from "react-router-dom";

// // const AdminUsers = () => {
// //     const [users, setUsers] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState("");
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         fetchUsers();
// //     }, []);

// //     const fetchUsers = async () => {
// //         try {
// //             const response = await fetch("http://localhost:5000/api/admin/users", {
// //                 headers: {
// //                     Authorization: `Bearer ${getToken()}`,
// //                 },
// //             });
// //             const data = await response.json();

// //             if (!response.ok) throw new Error(data.error);

// //             setUsers(data);
// //         } catch (err) {
// //             setError(err.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // ✅ NEW: Toggle user disabled status
// //     const toggleUserStatus = async (userId, currentStatus) => {
// //         const action = currentStatus ? "enable" : "disable";
// //         if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

// //         try {
// //             const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
// //                 method: "PATCH",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${getToken()}`,
// //                 },
// //                 body: JSON.stringify({ disabled: !currentStatus }),
// //             });

// //             if (!response.ok) throw new Error(`Failed to ${action} user`);

// //             fetchUsers();
// //             alert(`User ${action}d successfully`);
// //         } catch (err) {
// //             alert(err.message);
// //         }
// //     };

// //     const changeRole = async (userId, newRole) => {
// //         try {
// //             const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
// //                 method: "PATCH",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${getToken()}`,
// //                 },
// //                 body: JSON.stringify({ role: newRole }),
// //             });

// //             if (!response.ok) throw new Error("Failed to update role");

// //             fetchUsers();
// //             alert("Role updated successfully");
// //         } catch (err) {
// //             alert(err.message);
// //         }
// //     };

// //     const handleLogout = () => {
// //         logout();
// //         navigate("/login");
// //     };

// //     if (loading) return <div style={styles.loading}>Loading users...</div>;
// //     if (error) return <div style={styles.error}>Error: {error}</div>;

// //     return (
// //         <div style={styles.container}>
// //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //                 <h2>👥 User Management</h2>
// //                 <button onClick={handleLogout} style={styles.logoutBtn}>
// //                     🚪 Logout
// //                 </button>
// //             </div>

// //             <table style={styles.table}>
// //                 <thead>
// //                     <tr>
// //                         <th>Name</th>
// //                         <th>Email</th>
// //                         <th>Role</th>
// //                         <th>Status</th>
// //                         <th>Verified</th>
// //                         <th>Phone</th>
// //                         <th>Actions</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {users.map((user) => (
// //                         <tr key={user._id} style={user.disabled ? styles.disabledRow : {}}>
// //                             <td>{user.firstName} {user.lastName}</td>
// //                             <td>{user.email}</td>
// //                             <td>
// //                                 <select
// //                                     value={user.role}
// //                                     onChange={(e) => changeRole(user._id, e.target.value)}
// //                                     style={styles.select}
// //                                     disabled={user.disabled}
// //                                 >
// //                                     <option value="user">User</option>
// //                                     <option value="admin">Admin</option>
// //                                 </select>
// //                             </td>
// //                             <td>
// //                                 <span style={user.disabled ? styles.disabledBadge : styles.activeBadge}>
// //                                     {user.disabled ? "🔴 Disabled" : "🟢 Active"}
// //                                 </span>
// //                             </td>
// //                             <td>{user.isVerified ? "✅" : "❌"}</td>
// //                             <td>{user.phone || "N/A"}</td>
// //                             <td>
// //                                 <button
// //                                     onClick={() => toggleUserStatus(user._id, user.disabled)}
// //                                     style={user.disabled ? styles.enableBtn : styles.disableBtn}
// //                                 >
// //                                     {user.disabled ? "✅ Enable" : "🚫 Disable"}
// //                                 </button>
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>
// //         </div>
// //     );
// // };

// // const styles = {
// //     container: {
// //         padding: "20px",
// //         maxWidth: "1200px",
// //         margin: "0 auto",
// //     },
// //     table: {
// //         width: "100%",
// //         borderCollapse: "collapse",
// //         backgroundColor: "white",
// //         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
// //     },
// //     select: {
// //         padding: "5px",
// //         borderRadius: "4px",
// //         border: "1px solid #ddd",
// //     },
// //     disableBtn: {
// //         padding: "5px 10px",
// //         backgroundColor: "#ffc107",
// //         color: "#000",
// //         border: "none",
// //         borderRadius: "4px",
// //         cursor: "pointer",
// //         fontWeight: "500",
// //     },
// //     enableBtn: {
// //         padding: "5px 10px",
// //         backgroundColor: "#28a745",
// //         color: "white",
// //         border: "none",
// //         borderRadius: "4px",
// //         cursor: "pointer",
// //         fontWeight: "500",
// //     },
// //     logoutBtn: {
// //         padding: "5px 15px",
// //         backgroundColor: "#007bff",
// //         color: "white",
// //         border: "none",
// //         borderRadius: "4px",
// //         cursor: "pointer",
// //     },
// //     disabledRow: {
// //         backgroundColor: "#f8f9fa",
// //         opacity: 0.7,
// //     },
// //     activeBadge: {
// //         padding: "4px 8px",
// //         backgroundColor: "#d4edda",
// //         color: "#155724",
// //         borderRadius: "4px",
// //         fontSize: "12px",
// //         fontWeight: "500",
// //     },
// //     disabledBadge: {
// //         padding: "4px 8px",
// //         backgroundColor: "#f8d7da",
// //         color: "#721c24",
// //         borderRadius: "4px",
// //         fontSize: "12px",
// //         fontWeight: "500",
// //     },
// //     loading: {
// //         padding: "20px",
// //         textAlign: "center",
// //         fontSize: "18px",
// //     },
// //     error: {
// //         padding: "20px",
// //         textAlign: "center",
// //         fontSize: "18px",
// //         color: "#dc3545",
// //     },
// // };

// // export default AdminUsers;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getToken, logout } from "../services/auth";
// import AdminReportsPage from "./AdminReportsPage";
// import AdminChallengesPage from "./AdminChallengesPage";
// import AdminGroupsPage from "./AdminGroupsPage";

// const AdminDashboard = () => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState("users"); // users, reports, challenges, groups

//     // User Management State (from your existing code)
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (activeTab === "users") {
//             fetchUsers();
//         }
//     }, [activeTab]);

//     const fetchUsers = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/api/admin/users", {
//                 headers: {
//                     Authorization: `Bearer ${getToken()}`,
//                 },
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
//         { id: "users", label: "User Management", icon: "👥" },
//         { id: "reports", label: "Reports", icon: "🚨" },
//         { id: "challenges", label: "Challenges", icon: "🏆" },
//         { id: "groups", label: "Groups", icon: "📝" }
//     ];

//     return (
//         <div style={styles.container}>
//             {/* Header */}
//             <div style={styles.header}>
//                 <h1 style={styles.title}>🛡️ Admin Dashboard</h1>
//                 <button onClick={handleLogout} style={styles.logoutBtn}>
//                     🚪 Logout
//                 </button>
//             </div>

//             {/* Navigation Tabs */}
//             <div style={styles.tabsContainer}>
//                 {tabs.map(tab => (
//                     <button
//                         key={tab.id}
//                         onClick={() => setActiveTab(tab.id)}
//                         style={{
//                             ...styles.tab,
//                             ...(activeTab === tab.id ? styles.activeTab : {})
//                         }}
//                     >
//                         <span style={{ fontSize: "20px" }}>{tab.icon}</span>
//                         <span>{tab.label}</span>
//                     </button>
//                 ))}
//             </div>

//             {/* Content Area */}
//             <div style={styles.content}>
//                 {/* USER MANAGEMENT TAB */}
//                 {activeTab === "users" && (
//                     <div>
//                         <h2 style={{ marginBottom: "20px" }}>👥 User Management</h2>

//                         {loading ? (
//                             <div style={styles.loading}>Loading users...</div>
//                         ) : error ? (
//                             <div style={styles.error}>Error: {error}</div>
//                         ) : (
//                             <table style={styles.table}>
//                                 <thead>
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Email</th>
//                                         <th>Role</th>
//                                         <th>Status</th>
//                                         <th>Verified</th>
//                                         <th>Phone</th>
//                                         <th>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {users.map((user) => (
//                                         <tr key={user._id} style={user.disabled ? styles.disabledRow : {}}>
//                                             <td>{user.firstName} {user.lastName}</td>
//                                             <td>{user.email}</td>
//                                             <td>
//                                                 <select
//                                                     value={user.role}
//                                                     onChange={(e) => changeRole(user._id, e.target.value)}
//                                                     style={styles.select}
//                                                     disabled={user.disabled}
//                                                 >
//                                                     <option value="user">User</option>
//                                                     <option value="admin">Admin</option>
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <span style={user.disabled ? styles.disabledBadge : styles.activeBadge}>
//                                                     {user.disabled ? "🔴 Disabled" : "🟢 Active"}
//                                                 </span>
//                                             </td>
//                                             <td>{user.isVerified ? "✅" : "❌"}</td>
//                                             <td>{user.phone || "N/A"}</td>
//                                             <td>
//                                                 <button
//                                                     onClick={() => toggleUserStatus(user._id, user.disabled)}
//                                                     style={user.disabled ? styles.enableBtn : styles.disableBtn}
//                                                 >
//                                                     {user.disabled ? "✅ Enable" : "🚫 Disable"}
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 )}

//                 {/* OTHER TABS */}
//                 {activeTab === "reports" && <AdminReportsPage />}
//                 {activeTab === "challenges" && <AdminChallengesPage />}
//                 {activeTab === "groups" && <AdminGroupsPage />}
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         padding: "20px"
//     },
//     header: {
//         backgroundColor: "white",
//         padding: "20px 30px",
//         borderRadius: "12px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "20px"
//     },
//     title: {
//         margin: 0,
//         color: "#333",
//         fontSize: "28px"
//     },
//     logoutBtn: {
//         padding: "10px 20px",
//         backgroundColor: "#dc3545",
//         color: "white",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontWeight: "600",
//         fontSize: "16px"
//     },
//     tabsContainer: {
//         backgroundColor: "white",
//         padding: "10px",
//         borderRadius: "12px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         display: "flex",
//         gap: "10px",
//         marginBottom: "20px",
//         overflowX: "auto"
//     },
//     tab: {
//         flex: 1,
//         minWidth: "150px",
//         padding: "15px 20px",
//         backgroundColor: "transparent",
//         border: "2px solid transparent",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//         fontWeight: "500",
//         color: "#666",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "10px",
//         transition: "all 0.2s"
//     },
//     activeTab: {
//         backgroundColor: "#007bff",
//         color: "white",
//         borderColor: "#007bff"
//     },
//     content: {
//         backgroundColor: "white",
//         borderRadius: "12px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         padding: "30px",
//         minHeight: "600px"
//     },
//     table: {
//         width: "100%",
//         borderCollapse: "collapse",
//         backgroundColor: "white",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//     },
//     select: {
//         padding: "5px",
//         borderRadius: "4px",
//         border: "1px solid #ddd",
//     },
//     disableBtn: {
//         padding: "5px 10px",
//         backgroundColor: "#ffc107",
//         color: "#000",
//         border: "none",
//         borderRadius: "4px",
//         cursor: "pointer",
//         fontWeight: "500",
//     },
//     enableBtn: {
//         padding: "5px 10px",
//         backgroundColor: "#28a745",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
//         cursor: "pointer",
//         fontWeight: "500",
//     },
//     disabledRow: {
//         backgroundColor: "#f8f9fa",
//         opacity: 0.7,
//     },
//     activeBadge: {
//         padding: "4px 8px",
//         backgroundColor: "#d4edda",
//         color: "#155724",
//         borderRadius: "4px",
//         fontSize: "12px",
//         fontWeight: "500",
//     },
//     disabledBadge: {
//         padding: "4px 8px",
//         backgroundColor: "#f8d7da",
//         color: "#721c24",
//         borderRadius: "4px",
//         fontSize: "12px",
//         fontWeight: "500",
//     },
//     loading: {
//         padding: "20px",
//         textAlign: "center",
//         fontSize: "18px",
//     },
//     error: {
//         padding: "20px",
//         textAlign: "center",
//         fontSize: "18px",
//         color: "#dc3545",
//     }
// };

// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, logout } from "../services/auth";
import { Users, AlertTriangle, Trophy, UserPlus, LogOut } from 'lucide-react';
import AdminReportsPage from "./AdminReportsPage";
import AdminChallengesPage from "./AdminChallengesPage";
import AdminGroupsPage from "./AdminGroupsPage";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        const action = currentStatus ? "enable" : "disable";
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ disabled: !currentStatus }),
            });

            if (!response.ok) throw new Error(`Failed to ${action} user`);
            fetchUsers();
            alert(`User ${action}d successfully`);
        } catch (err) {
            alert(err.message);
        }
    };

    const changeRole = async (userId, newRole) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error("Failed to update role");
            fetchUsers();
            alert("Role updated successfully");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const tabs = [
        { id: "users", label: "Users", icon: Users, color: "from-[#f4873e] to-[#ff9e5e]" },
        { id: "reports", label: "Reports", icon: AlertTriangle, color: "from-red-500 to-red-600" },
        { id: "challenges", label: "Challenges", icon: Trophy, color: "from-yellow-500 to-yellow-600" },
        { id: "groups", label: "Groups", icon: UserPlus, color: "from-[#89beab] to-[#6fa893]" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-[40px] p-6 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold" style={{ fontFamily: "Brasika" }}>
                            <span className="text-[#f4873e] dark:text-orange-400">Admin </span>
                            <span className="text-[#89beab] dark:text-teal-400">Dashboard</span>
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-[40px] p-4 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-4 gap-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        relative overflow-hidden rounded-3xl p-6 transition-all duration-300
                                        ${isActive 
                                            ? `bg-gradient-to-br ${tab.color} text-white shadow-lg scale-105` 
                                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-102 hover:shadow-md'
                                        }
                                    `}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <Icon className="w-8 h-8" />
                                        <span className="font-bold text-lg">{tab.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-700 min-h-[600px]">
                    
                    {/* USER MANAGEMENT TAB */}
                    {activeTab === "users" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
                                <Users className="w-7 h-7 text-[#f4873e]" />
                                User Management
                            </h2>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Name</th>
                                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Email</th>
                                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Role</th>
                                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Status</th>
                                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Verified</th>
                                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Phone</th>
                                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr 
                                                    key={user._id} 
                                                    className={`
                                                        border-b border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors
                                                        ${user.disabled ? 'opacity-50 bg-gray-50 dark:bg-gray-700/30' : ''}
                                                    `}
                                                >
                                                    <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                                                        {user.firstName} {user.lastName}
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => changeRole(user._id, e.target.value)}
                                                            disabled={user.disabled}
                                                            className="px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#f4873e] disabled:opacity-50"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`
                                                            px-4 py-2 rounded-full text-sm font-bold
                                                            ${user.disabled 
                                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                                                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                            }
                                                        `}>
                                                            {user.disabled ? "🔴 Disabled" : "🟢 Active"}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-2xl">
                                                        {user.isVerified ? "✅" : "❌"}
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                        {user.phone || "N/A"}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <button
                                                            onClick={() => toggleUserStatus(user._id, user.disabled)}
                                                            className={`
                                                                px-5 py-2 rounded-full font-bold text-white transition-all hover:shadow-lg
                                                                ${user.disabled 
                                                                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                                                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                                                }
                                                            `}
                                                        >
                                                            {user.disabled ? "✅ Enable" : "🚫 Disable"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* OTHER TABS */}
                    {activeTab === "reports" && <AdminReportsPage />}
                    {activeTab === "challenges" && <AdminChallengesPage />}
                    {activeTab === "groups" && <AdminGroupsPage />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;