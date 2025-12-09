import React, { useState, useEffect } from "react";
import { getToken, logout } from "../services/auth"; // make sure logout exists
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
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

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete user");

            fetchUsers();
            alert("User deleted successfully");
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
        logout();        // clears token
        navigate("/login"); // redirect to login page
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>👥 User Management</h2>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    🚪 Logout
                </button>
            </div>
            
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Verified</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => changeRole(user._id, e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>{user.isVerified ? "✅" : "❌"}</td>
                            <td>{user.phone || "N/A"}</td>
                            <td>
                                <button
                                    onClick={() => deleteUser(user._id)}
                                    style={styles.deleteBtn}
                                >
                                    🗑️ Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    select: {
        padding: "5px",
        borderRadius: "4px",
        border: "1px solid #ddd",
    },
    deleteBtn: {
        padding: "5px 10px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    logoutBtn: {
        padding: "5px 15px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default AdminUsers;
