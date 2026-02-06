// import React, { useState, useEffect } from "react";
// import { getToken } from "../services/auth";

// const AdminGroupsPage = () => {
//     const [groups, setGroups] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [selectedGroup, setSelectedGroup] = useState(null);
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         category: "journaling",
//         icon: "📝",
//         maxMembers: 50,
//         weeklyTask: ""
//     });

//     useEffect(() => {
//         fetchGroups();
//     }, []);

//     const fetchGroups = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 "http://localhost:5000/api/groups?limit=100",
//                 {
//                     headers: { Authorization: `Bearer ${getToken()}` }
//                 }
//             );
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.error);
//             setGroups(data.groups || []);
//         } catch (err) {
//             alert(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCreateGroup = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch("http://localhost:5000/api/groups", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getToken()}`
//                 },
//                 body: JSON.stringify(formData)
//             });

//             if (!response.ok) throw new Error("Failed to create group");

//             alert("Group created successfully!");
//             setShowCreateModal(false);
//             resetForm();
//             fetchGroups();
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const updateWeeklyTask = async (groupId) => {
//         const task = prompt("Enter new weekly task:");
//         if (!task) return;

//         try {
//             const response = await fetch(
//                 `http://localhost:5000/api/groups/${groupId}`,
//                 {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${getToken()}`
//                     },
//                     body: JSON.stringify({
//                         weeklyTask: {
//                             task,
//                             week: new Date()
//                         }
//                     })
//                 }
//             );

//             if (!response.ok) throw new Error("Failed to update task");
//             alert("Weekly task updated!");
//             fetchGroups();
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const deleteGroup = async (groupId) => {
//         if (!window.confirm("Are you sure you want to delete this group?")) return;

//         try {
//             const response = await fetch(
//                 `http://localhost:5000/api/groups/${groupId}`,
//                 {
//                     method: "DELETE",
//                     headers: { Authorization: `Bearer ${getToken()}` }
//                 }
//             );

//             if (!response.ok) throw new Error("Failed to delete group");
//             alert("Group deleted successfully");
//             fetchGroups();
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             name: "",
//             description: "",
//             category: "journaling",
//             icon: "📝",
//             maxMembers: 50,
//             weeklyTask: ""
//         });
//     };

//     const categoryIcons = {
//         journaling: "📝",
//         gratitude: "🙏",
//         mindfulness: "🧘",
//         fitness: "💪",
//         habits: "✅",
//         goals: "🎯",
//         wellness: "💚",
//         other: "✨"
//     };

//     if (loading) return <div style={styles.loading}>Loading groups...</div>;

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <h2>👥 Support Groups Management</h2>
//                 <button onClick={() => setShowCreateModal(true)} style={styles.createBtn}>
//                     ➕ Create Group
//                 </button>
//             </div>

//             {/* Groups Grid */}
//             <div style={styles.grid}>
//                 {groups.map(group => (
//                     <div key={group._id} style={styles.card}>
//                         <div style={styles.cardHeader}>
//                             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                                 <span style={{ fontSize: "32px" }}>{group.icon || categoryIcons[group.category]}</span>
//                                 <div>
//                                     <h3 style={{ margin: 0 }}>{group.name}</h3>
//                                     <span style={styles.categoryBadge}>{group.category}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <p style={styles.description}>{group.description}</p>

//                         <div style={styles.stats}>
//                             <div style={styles.statItem}>
//                                 <span style={{ fontSize: "12px", color: "#666" }}>Members</span>
//                                 <strong>{group.memberCount || group.members?.length || 0}</strong>
//                             </div>
//                             <div style={styles.statItem}>
//                                 <span style={{ fontSize: "12px", color: "#666" }}>Capacity</span>
//                                 <strong>{group.maxMembers}</strong>
//                             </div>
//                             <div style={styles.statItem}>
//                                 <span style={{ fontSize: "12px", color: "#666" }}>Status</span>
//                                 <strong style={{ color: group.isActive ? "#28a745" : "#dc3545" }}>
//                                     {group.isActive ? "Active" : "Inactive"}
//                                 </strong>
//                             </div>
//                         </div>

//                         {group.weeklyTask?.task && (
//                             <div style={styles.weeklyTask}>
//                                 <strong>Weekly Task:</strong>
//                                 <p>{group.weeklyTask.task}</p>
//                                 <small>Completed by: {group.weeklyTask.completedBy?.length || 0} members</small>
//                             </div>
//                         )}

//                         <div style={styles.cardActions}>
//                             <button
//                                 onClick={() => updateWeeklyTask(group._id)}
//                                 style={{ ...styles.actionBtn, backgroundColor: "#17a2b8" }}
//                             >
//                                 Update Task
//                             </button>
//                             <button
//                                 onClick={() => deleteGroup(group._id)}
//                                 style={{ ...styles.actionBtn, backgroundColor: "#dc3545" }}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Create Group Modal */}
//             {showCreateModal && (
//                 <div style={styles.modal} onClick={() => setShowCreateModal(false)}>
//                     <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//                         <h2>Create New Support Group</h2>
//                         <form onSubmit={handleCreateGroup} style={styles.form}>
//                             <div style={styles.formGroup}>
//                                 <label>Group Name *</label>
//                                 <input
//                                     type="text"
//                                     value={formData.name}
//                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                     required
//                                     style={styles.input}
//                                     placeholder="e.g., Daily Gratitude Circle"
//                                 />
//                             </div>

//                             <div style={styles.formGroup}>
//                                 <label>Description *</label>
//                                 <textarea
//                                     value={formData.description}
//                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                     required
//                                     rows="4"
//                                     style={styles.textarea}
//                                     placeholder="Describe the group's purpose and activities..."
//                                 />
//                             </div>

//                             <div style={styles.formRow}>
//                                 <div style={styles.formGroup}>
//                                     <label>Category *</label>
//                                     <select
//                                         value={formData.category}
//                                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                                         style={styles.select}
//                                     >
//                                         <option value="journaling">Journaling</option>
//                                         <option value="gratitude">Gratitude</option>
//                                         <option value="mindfulness">Mindfulness</option>
//                                         <option value="fitness">Fitness</option>
//                                         <option value="habits">Habits</option>
//                                         <option value="goals">Goals</option>
//                                         <option value="wellness">Wellness</option>
//                                         <option value="other">Other</option>
//                                     </select>
//                                 </div>

//                                 <div style={styles.formGroup}>
//                                     <label>Icon (emoji)</label>
//                                     <input
//                                         type="text"
//                                         value={formData.icon}
//                                         onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
//                                         style={styles.input}
//                                         placeholder={categoryIcons[formData.category]}
//                                     />
//                                 </div>
//                             </div>

//                             <div style={styles.formGroup}>
//                                 <label>Max Members *</label>
//                                 <input
//                                     type="number"
//                                     value={formData.maxMembers}
//                                     onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
//                                     required
//                                     min="5"
//                                     max="100"
//                                     style={styles.input}
//                                 />
//                             </div>

//                             <div style={styles.formGroup}>
//                                 <label>Initial Weekly Task (optional)</label>
//                                 <input
//                                     type="text"
//                                     value={formData.weeklyTask}
//                                     onChange={(e) => setFormData({ ...formData, weeklyTask: e.target.value })}
//                                     style={styles.input}
//                                     placeholder="e.g., Share one thing you're grateful for"
//                                 />
//                             </div>

//                             <div style={styles.modalActions}>
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setShowCreateModal(false);
//                                         resetForm();
//                                     }}
//                                     style={{ ...styles.modalBtn, backgroundColor: "#6c757d" }}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     style={{ ...styles.modalBtn, backgroundColor: "#28a745" }}
//                                 >
//                                     Create Group
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const styles = {
//     container: {
//         padding: "20px",
//         maxWidth: "1400px",
//         margin: "0 auto"
//     },
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "30px"
//     },
//     createBtn: {
//         padding: "12px 24px",
//         backgroundColor: "#28a745",
//         color: "white",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontWeight: "600",
//         fontSize: "16px"
//     },
//     grid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
//         gap: "20px"
//     },
//     card: {
//         backgroundColor: "white",
//         borderRadius: "12px",
//         padding: "20px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
//     },
//     cardHeader: {
//         marginBottom: "15px"
//     },
//     categoryBadge: {
//         padding: "4px 12px",
//         backgroundColor: "#e9ecef",
//         borderRadius: "4px",
//         fontSize: "12px",
//         fontWeight: "500"
//     },
//     description: {
//         color: "#666",
//         marginBottom: "15px",
//         lineHeight: "1.5",
//         fontSize: "14px"
//     },
//     stats: {
//         display: "grid",
//         gridTemplateColumns: "repeat(3, 1fr)",
//         gap: "10px",
//         marginBottom: "15px"
//     },
//     statItem: {
//         display: "flex",
//         flexDirection: "column",
//         padding: "10px",
//         backgroundColor: "#f8f9fa",
//         borderRadius: "6px",
//         textAlign: "center"
//     },
//     weeklyTask: {
//         backgroundColor: "#fff3cd",
//         padding: "12px",
//         borderRadius: "8px",
//         marginBottom: "15px",
//         fontSize: "14px"
//     },
//     cardActions: {
//         display: "flex",
//         gap: "10px"
//     },
//     actionBtn: {
//         flex: 1,
//         padding: "8px",
//         border: "none",
//         borderRadius: "6px",
//         color: "white",
//         cursor: "pointer",
//         fontWeight: "500"
//     },
//     modal: {
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1000
//     },
//     modalContent: {
//         backgroundColor: "white",
//         padding: "30px",
//         borderRadius: "12px",
//         maxWidth: "600px",
//         width: "90%",
//         maxHeight: "90vh",
//         overflow: "auto"
//     },
//     form: {
//         marginTop: "20px"
//     },
//     formGroup: {
//         marginBottom: "20px"
//     },
//     formRow: {
//         display: "grid",
//         gridTemplateColumns: "1fr 1fr",
//         gap: "15px"
//     },
//     input: {
//         width: "100%",
//         padding: "10px",
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//         fontSize: "14px",
//         marginTop: "5px"
//     },
//     textarea: {
//         width: "100%",
//         padding: "10px",
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//         fontSize: "14px",
//         marginTop: "5px",
//         fontFamily: "inherit",
//         resize: "vertical"
//     },
//     select: {
//         width: "100%",
//         padding: "10px",
//         border: "1px solid #ddd",
//         borderRadius: "6px",
//         fontSize: "14px",
//         marginTop: "5px"
//     },
//     modalActions: {
//         display: "flex",
//         gap: "10px",
//         marginTop: "30px"
//     },
//     modalBtn: {
//         flex: 1,
//         padding: "12px",
//         border: "none",
//         borderRadius: "6px",
//         color: "white",
//         cursor: "pointer",
//         fontWeight: "600",
//         fontSize: "16px"
//     },
//     loading: {
//         padding: "40px",
//         textAlign: "center",
//         fontSize: "18px"
//     }
// };

// export default AdminGroupsPage;
import React, { useState, useEffect } from "react";
import { getToken } from "../services/auth";
import { UserPlus, Plus, Users, Calendar, Trash2, Edit, X } from 'lucide-react';

const AdminGroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "journaling",
        icon: "📝",
        maxMembers: 50,
        weeklyTask: ""
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:5000/api/groups?limit=100",
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setGroups(data.groups || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to create group");

            alert("Group created successfully!");
            setShowCreateModal(false);
            resetForm();
            fetchGroups();
        } catch (err) {
            alert(err.message);
        }
    };

    const updateWeeklyTask = async (groupId) => {
        const task = prompt("Enter new weekly task:");
        if (!task) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/groups/${groupId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        weeklyTask: {
                            task,
                            week: new Date()
                        }
                    })
                }
            );

            if (!response.ok) throw new Error("Failed to update task");
            alert("Weekly task updated!");
            fetchGroups();
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/groups/${groupId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${getToken()}` }
                }
            );

            if (!response.ok) throw new Error("Failed to delete group");
            alert("Group deleted successfully");
            fetchGroups();
        } catch (err) {
            alert(err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            category: "journaling",
            icon: "📝",
            maxMembers: 50,
            weeklyTask: ""
        });
    };

    const categoryIcons = {
        journaling: "📝",
        gratitude: "🙏",
        mindfulness: "🧘",
        fitness: "💪",
        habits: "✅",
        goals: "🎯",
        wellness: "💚",
        other: "✨"
    };

    const categoryColors = {
        journaling: "from-purple-500 to-purple-600",
        gratitude: "from-yellow-500 to-yellow-600",
        mindfulness: "from-indigo-500 to-indigo-600",
        fitness: "from-red-500 to-red-600",
        habits: "from-blue-500 to-blue-600",
        goals: "from-green-500 to-green-600",
        wellness: "from-pink-500 to-pink-600",
        other: "from-gray-500 to-gray-600"
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
                    <UserPlus className="w-7 h-7 text-[#89beab]" />
                    Support Groups Management
                </h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Create Group
                </button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                    <div key={group._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">{group.icon || categoryIcons[group.category]}</span>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                    {group.name}
                                </h3>
                                <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[group.category]} text-white rounded-full text-xs font-bold`}>
                                    {group.category}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {group.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
                                <p className="font-bold text-gray-900 dark:text-white">{group.memberCount || group.members?.length || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                <Users className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Capacity</p>
                                <p className="font-bold text-gray-900 dark:text-white">{group.maxMembers}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                <div className={`w-4 h-4 mx-auto mb-1 rounded-full ${group.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                                <p className={`font-bold ${group.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {group.isActive ? "Active" : "Inactive"}
                                </p>
                            </div>
                        </div>

                        {/* Weekly Task */}
                        {group.weeklyTask?.task && (
                            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">Weekly Task</p>
                                        <p className="text-sm text-orange-800 dark:text-orange-200">{group.weeklyTask.task}</p>
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                            ✓ {group.weeklyTask.completedBy?.length || 0} completed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateWeeklyTask(group._id)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-md transition-all"
                            >
                                <Edit className="w-4 h-4" />
                                Update Task
                            </button>
                            <button
                                onClick={() => deleteGroup(group._id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold hover:shadow-md transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                Create New Support Group
                            </h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateGroup} className="space-y-6">
                            {/* Group Name */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Group Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#89beab]"
                                    placeholder="e.g., Daily Gratitude Circle"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#89beab] resize-none"
                                    placeholder="Describe the group's purpose and activities..."
                                />
                            </div>

                            {/* Category & Icon */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#89beab]"
                                    >
                                        <option value="journaling">Journaling</option>
                                        <option value="gratitude">Gratitude</option>
                                        <option value="mindfulness">Mindfulness</option>
                                        <option value="fitness">Fitness</option>
                                        <option value="habits">Habits</option>
                                        <option value="goals">Goals</option>
                                        <option value="wellness">Wellness</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Icon (emoji)</label>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#89beab]"
                                        placeholder={categoryIcons[formData.category]}
                                    />
                                </div>
                            </div>

                            {/* Max Members */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max Members *</label>
                                <input
                                    type="number"
                                    value={formData.maxMembers}
                                    onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                                    required
                                    min="5"
                                    max="100"
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#89beab]"
                                />
                            </div>

                            {/* Initial Weekly Task */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Initial Weekly Task (optional)</label>
                                <input
                                    type="text"
                                    value={formData.weeklyTask}
                                    onChange={(e) => setFormData({ ...formData, weeklyTask: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#89beab]"
                                    placeholder="e.g., Share one thing you're grateful for"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg transition-all"
                                >
                                    Create Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGroupsPage;