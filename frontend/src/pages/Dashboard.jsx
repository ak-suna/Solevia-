// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { logout } from "../services/auth";

// // const Dashboard = () => {
// //     const navigate = useNavigate();

// //     const handleLogout = () => {
// //         logout();
// //         navigate("/login");
// //     };

// //     return (
// //         <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
// //             <h1>Dashboard</h1>
// //             <p>Welcome! You are logged in.</p>
// //             <button
// //                 onClick={handleLogout}
// //                 style={{
// //                     padding: "10px 20px",
// //                     background: "#dc3545",
// //                     color: "white",
// //                     border: "none",
// //                     cursor: "pointer",
// //                 }}
// //             >
// //                 Logout
// //             </button>
// //         </div>
// //     );
// // };

// // export default Dashboard;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getRole, isVerified } from "../services/auth";

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const [userRole, setUserRole] = useState("");
//     const [emailVerified, setEmailVerified] = useState(false);

//     useEffect(() => {
//         setUserRole(getRole());
//         setEmailVerified(isVerified());
//     }, []);

//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <h1>Dashboard</h1>
//                 <button onClick={handleLogout} style={styles.logoutBtn}>
//                     Logout
//                 </button>
//             </div>

//             {/* Email Verification Warning */}
//             {!emailVerified && (
//                 <div style={styles.warningBanner}>
//                     ⚠️ Please verify your email address. Check your inbox for the verification link.
//                 </div>
//             )}

//             {/* Role Badge */}
//             <div style={styles.roleBadge}>
//                 <span style={userRole === "admin" ? styles.adminBadge : styles.userBadge}>
//                     {userRole === "admin" ? "👑 ADMIN" : "👤 USER"}
//                 </span>
//             </div>

//             {/* Admin Section */}
//             {userRole === "admin" && (
//                 <div style={styles.adminSection}>
//                     <h2>🔐 Admin Panel</h2>
//                     <div style={styles.adminCards}>
//                         <div style={styles.card}>
//                             <h3>Manage Users</h3>
//                             <p>View and manage all users</p>
//                             <button 
//                             style={styles.adminBtn}
//                             onClick={() => navigate("/admin/users")}
//                 >
//                             View Users
//                             </button>
//                         </div>
//                         <div style={styles.card}>
//                             <h3>Manage Products</h3>
//                             <p>Add, edit, or delete products</p>
//                             <button style={styles.adminBtn}>Manage Products</button>
//                         </div>
//                         <div style={styles.card}>
//                             <h3>View Analytics</h3>
//                             <p>Check system analytics</p>
//                             <button style={styles.adminBtn}>Analytics</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* User Section */}
//             {userRole === "user" && (
//                 <div style={styles.userSection}>
//                     <h2>Welcome, User! 👋</h2>
//                     <div style={styles.userCards}>
//                         <div style={styles.card}>
//                             <h3>My Profile</h3>
//                             <p>View and edit your profile</p>
//                             <button style={styles.userBtn}>View Profile</button>
//                         </div>
//                         <div style={styles.card}>
//                             <h3>My Orders</h3>
//                             <p>Track your orders</p>
//                             <button style={styles.userBtn}>View Orders</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const styles = {
//     container: {
//         padding: "20px",
//         maxWidth: "1200px",
//         margin: "0 auto",
//     },
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "20px",
//     },
//     logoutBtn: {
//         padding: "10px 20px",
//         backgroundColor: "#dc3545",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//     },
//     warningBanner: {
//         backgroundColor: "#fff3cd",
//         color: "#856404",
//         padding: "15px",
//         borderRadius: "5px",
//         marginBottom: "20px",
//         border: "1px solid #ffeaa7",
//     },
//     roleBadge: {
//         marginBottom: "20px",
//     },
//     adminBadge: {
//         backgroundColor: "#6f42c1",
//         color: "white",
//         padding: "8px 16px",
//         borderRadius: "20px",
//         fontWeight: "bold",
//     },
//     userBadge: {
//         backgroundColor: "#007bff",
//         color: "white",
//         padding: "8px 16px",
//         borderRadius: "20px",
//         fontWeight: "bold",
//     },
//     adminSection: {
//         backgroundColor: "#f8f9fa",
//         padding: "20px",
//         borderRadius: "10px",
//         border: "2px solid #6f42c1",
//     },
//     userSection: {
//         backgroundColor: "#f8f9fa",
//         padding: "20px",
//         borderRadius: "10px",
//         border: "2px solid #007bff",
//     },
//     adminCards: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//         gap: "20px",
//         marginTop: "20px",
//     },
//     userCards: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//         gap: "20px",
//         marginTop: "20px",
//     },
//     card: {
//         backgroundColor: "white",
//         padding: "20px",
//         borderRadius: "8px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//     },
//     adminBtn: {
//         marginTop: "10px",
//         padding: "8px 16px",
//         backgroundColor: "#6f42c1",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//         width: "100%",
//     },
//     userBtn: {
//         marginTop: "10px",
//         padding: "8px 16px",
//         backgroundColor: "#007bff",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//         width: "100%",
//     },
// };

// export default Dashboard;
// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { getRole } from "../services/auth"; 
// getRole() should read role from token/localStorage
import { isAdmin } from "../services/auth";


const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin()) {
        navigate("/admin/dashboard");
    } else {
        navigate("/user/dashboard");
    }
}, [navigate]);


  return null; // nothing shown, only redirects
};

export default Dashboard;
