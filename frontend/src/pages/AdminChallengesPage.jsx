// // // // import React, { useState, useEffect } from "react";
// // // // import { getToken } from "../services/auth";

// // // // const AdminChallengesPage = () => {
// // // //     const [challenges, setChallenges] = useState([]);
// // // //     const [loading, setLoading] = useState(true);
// // // //     const [showCreateModal, setShowCreateModal] = useState(false);
// // // //     const [formData, setFormData] = useState({
// // // //         title: "",
// // // //         description: "",
// // // //         type: "daily",
// // // //         category: "habits",
// // // //         icon: "🎯",
// // // //         duration: 7,
// // // //         startDate: "",
// // // //         rules: "",
// // // //         dailyGoalDescription: "",
// // // //         dailyGoalTarget: 1,
// // // //         maxParticipants: null,
// // // //         rewardBadge: "🏆",
// // // //         rewardPoints: 100,
// // // //         isFeatured: false
// // // //     });

// // // //     useEffect(() => {
// // // //         fetchChallenges();
// // // //     }, []);

// // // //     const fetchChallenges = async () => {
// // // //         setLoading(true);
// // // //         try {
// // // //             const response = await fetch(
// // // //                 "http://localhost:5000/api/challenges?status=all&limit=100",
// // // //                 {
// // // //                     headers: { Authorization: `Bearer ${getToken()}` }
// // // //                 }
// // // //             );
// // // //             const data = await response.json();
// // // //             if (!response.ok) throw new Error(data.error);
// // // //             setChallenges(data.challenges || []);
// // // //         } catch (err) {
// // // //             alert(err.message);
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const handleCreateChallenge = async (e) => {
// // // //         e.preventDefault();

// // // //         const rulesArray = formData.rules
// // // //             .split("\n")
// // // //             .filter(rule => rule.trim())
// // // //             .map(rule => rule.trim());

// // // //         const challengeData = {
// // // //             title: formData.title,
// // // //             description: formData.description,
// // // //             type: formData.type,
// // // //             category: formData.category,
// // // //             icon: formData.icon,
// // // //             duration: parseInt(formData.duration),
// // // //             startDate: formData.startDate,
// // // //             rules: rulesArray,
// // // //             dailyGoal: {
// // // //                 description: formData.dailyGoalDescription,
// // // //                 target: parseInt(formData.dailyGoalTarget)
// // // //             },
// // // //             maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
// // // //             rewards: {
// // // //                 badge: formData.rewardBadge,
// // // //                 points: parseInt(formData.rewardPoints)
// // // //             }
// // // //         };

// // // //         try {
// // // //             const response = await fetch("http://localhost:5000/api/challenges", {
// // // //                 method: "POST",
// // // //                 headers: {
// // // //                     "Content-Type": "application/json",
// // // //                     Authorization: `Bearer ${getToken()}`
// // // //                 },
// // // //                 body: JSON.stringify(challengeData)
// // // //             });

// // // //             if (!response.ok) throw new Error("Failed to create challenge");

// // // //             alert("Challenge created successfully!");
// // // //             setShowCreateModal(false);
// // // //             resetForm();
// // // //             fetchChallenges();
// // // //         } catch (err) {
// // // //             alert(err.message);
// // // //         }
// // // //     };

// // // //     const toggleFeatured = async (challengeId, currentStatus) => {
// // // //         try {
// // // //             const response = await fetch(
// // // //                 `http://localhost:5000/api/challenges/${challengeId}`,
// // // //                 {
// // // //                     method: "PUT",
// // // //                     headers: {
// // // //                         "Content-Type": "application/json",
// // // //                         Authorization: `Bearer ${getToken()}`
// // // //                     },
// // // //                     body: JSON.stringify({ isFeatured: !currentStatus })
// // // //                 }
// // // //             );

// // // //             if (!response.ok) throw new Error("Failed to update challenge");
// // // //             fetchChallenges();
// // // //         } catch (err) {
// // // //             alert(err.message);
// // // //         }
// // // //     };

// // // //     const deleteChallenge = async (challengeId) => {
// // // //         if (!window.confirm("Are you sure you want to delete this challenge?")) return;

// // // //         try {
// // // //             const response = await fetch(
// // // //                 `http://localhost:5000/api/challenges/${challengeId}`,
// // // //                 {
// // // //                     method: "DELETE",
// // // //                     headers: { Authorization: `Bearer ${getToken()}` }
// // // //                 }
// // // //             );

// // // //             if (!response.ok) throw new Error("Failed to delete challenge");
// // // //             alert("Challenge deleted successfully");
// // // //             fetchChallenges();
// // // //         } catch (err) {
// // // //             alert(err.message);
// // // //         }
// // // //     };

// // // //     const resetForm = () => {
// // // //         setFormData({
// // // //             title: "",
// // // //             description: "",
// // // //             type: "daily",
// // // //             category: "habits",
// // // //             icon: "🎯",
// // // //             duration: 7,
// // // //             startDate: "",
// // // //             rules: "",
// // // //             dailyGoalDescription: "",
// // // //             dailyGoalTarget: 1,
// // // //             maxParticipants: null,
// // // //             rewardBadge: "🏆",
// // // //             rewardPoints: 100,
// // // //             isFeatured: false
// // // //         });
// // // //     };

// // // //     const getChallengeStatus = (challenge) => {
// // // //         const now = new Date();
// // // //         const start = new Date(challenge.startDate);
// // // //         const end = new Date(challenge.endDate);

// // // //         if (now < start) return { label: "Upcoming", color: "#17a2b8" };
// // // //         if (now > end) return { label: "Ended", color: "#6c757d" };
// // // //         return { label: "Active", color: "#28a745" };
// // // //     };

// // // //     if (loading) return <div style={styles.loading}>Loading challenges...</div>;

// // // //     return (
// // // //         <div style={styles.container}>
// // // //             <div style={styles.header}>
// // // //                 <h2>🏆 Challenge Management</h2>
// // // //                 <button onClick={() => setShowCreateModal(true)} style={styles.createBtn}>
// // // //                     ➕ Create Challenge
// // // //                 </button>
// // // //             </div>

// // // //             {/* Challenges Grid */}
// // // //             <div style={styles.grid}>
// // // //                 {challenges.map(challenge => {
// // // //                     const status = getChallengeStatus(challenge);
// // // //                     return (
// // // //                         <div key={challenge._id} style={styles.card}>
// // // //                             <div style={styles.cardHeader}>
// // // //                                 <div>
// // // //                                     <span style={{ fontSize: "32px" }}>{challenge.icon}</span>
// // // //                                     {challenge.isFeatured && (
// // // //                                         <span style={styles.featuredBadge}>⭐ Featured</span>
// // // //                                     )}
// // // //                                 </div>
// // // //                                 <span
// // // //                                     style={{
// // // //                                         ...styles.statusBadge,
// // // //                                         backgroundColor: status.color
// // // //                                     }}
// // // //                                 >
// // // //                                     {status.label}
// // // //                                 </span>
// // // //                             </div>

// // // //                             <h3>{challenge.title}</h3>
// // // //                             <p style={styles.description}>{challenge.description}</p>

// // // //                             <div style={styles.stats}>
// // // //                                 <div style={styles.statItem}>
// // // //                                     <span>Duration</span>
// // // //                                     <strong>{challenge.duration} days</strong>
// // // //                                 </div>
// // // //                                 <div style={styles.statItem}>
// // // //                                     <span>Participants</span>
// // // //                                     <strong>{challenge.participantCount || 0}</strong>
// // // //                                 </div>
// // // //                                 <div style={styles.statItem}>
// // // //                                     <span>Completion</span>
// // // //                                     <strong>{challenge.completionRate || 0}%</strong>
// // // //                                 </div>
// // // //                             </div>

// // // //                             <div style={styles.cardActions}>
// // // //                                 <button
// // // //                                     onClick={() => toggleFeatured(challenge._id, challenge.isFeatured)}
// // // //                                     style={{
// // // //                                         ...styles.actionBtn,
// // // //                                         backgroundColor: challenge.isFeatured ? "#6c757d" : "#ffc107"
// // // //                                     }}
// // // //                                 >
// // // //                                     {challenge.isFeatured ? "Unfeature" : "Feature"}
// // // //                                 </button>
// // // //                                 <button
// // // //                                     onClick={() => deleteChallenge(challenge._id)}
// // // //                                     style={{
// // // //                                         ...styles.actionBtn,
// // // //                                         backgroundColor: "#dc3545"
// // // //                                     }}
// // // //                                 >
// // // //                                     Delete
// // // //                                 </button>
// // // //                             </div>
// // // //                         </div>
// // // //                     );
// // // //                 })}
// // // //             </div>

// // // //             {/* Create Challenge Modal */}
// // // //             {showCreateModal && (
// // // //                 <div style={styles.modal} onClick={() => setShowCreateModal(false)}>
// // // //                     <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
// // // //                         <h2>Create New Challenge</h2>
// // // //                         <form onSubmit={handleCreateChallenge} style={styles.form}>
// // // //                             <div style={styles.formGroup}>
// // // //                                 <label>Title *</label>
// // // //                                 <input
// // // //                                     type="text"
// // // //                                     value={formData.title}
// // // //                                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // // //                                     required
// // // //                                     style={styles.input}
// // // //                                 />
// // // //                             </div>

// // // //                             <div style={styles.formGroup}>
// // // //                                 <label>Description *</label>
// // // //                                 <textarea
// // // //                                     value={formData.description}
// // // //                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // // //                                     required
// // // //                                     rows="3"
// // // //                                     style={styles.textarea}
// // // //                                 />
// // // //                             </div>

// // // //                             <div style={styles.formRow}>
// // // //                                 <div style={styles.formGroup}>
// // // //                                     <label>Type</label>
// // // //                                     <select
// // // //                                         value={formData.type}
// // // //                                         onChange={(e) => setFormData({ ...formData, type: e.target.value })}
// // // //                                         style={styles.select}
// // // //                                     >
// // // //                                         <option value="daily">Daily</option>
// // // //                                         <option value="weekly">Weekly</option>
// // // //                                         <option value="custom">Custom</option>
// // // //                                     </select>
// // // //                                 </div>

// // // //                                 <div style={styles.formGroup}>
// // // //                                     <label>Category</label>
// // // //                                     <select
// // // //                                         value={formData.category}
// // // //                                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
// // // //                                         style={styles.select}
// // // //                                     >
// // // //                                         <option value="habits">Habits</option>
// // // //                                         <option value="gratitude">Gratitude</option>
// // // //                                         <option value="mindfulness">Mindfulness</option>
// // // //                                         <option value="fitness">Fitness</option>
// // // //                                         <option value="journaling">Journaling</option>
// // // //                                         <option value="wellness">Wellness</option>
// // // //                                         <option value="digital-detox">Digital Detox</option>
// // // //                                     </select>
// // // //                                 </div>
// // // //                             </div>

// // // //                             <div style={styles.formRow}>
// // // //                                 <div style={styles.formGroup}>
// // // //                                     <label>Icon (emoji)</label>
// // // //                                     <input
// // // //                                         type="text"
// // // //                                         value={formData.icon}
// // // //                                         onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
// // // //                                         style={styles.input}
// // // //                                         placeholder="🎯"
// // // //                                     />
// // // //                                 </div>

// // // //                                 <div style={styles.formGroup}>
// // // //                                     <label>Duration (days)</label>
// // // //                                     <input
// // // //                                         type="number"
// // // //                                         value={formData.duration}
// // // //                                         onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
// // // //                                         required
// // // //                                         min="1"
// // // //                                         style={styles.input}
// // // //                                     />
// // // //                                 </div>
// // // //                             </div>

// // // //                             <div style={styles.formGroup}>
// // // //                                 <label>Start Date *</label>
// // // //                                 <input
// // // //                                     type="date"
// // // //                                     value={formData.startDate}
// // // //                                     onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
// // // //                                     required
// // // //                                     style={styles.input}
// // // //                                 />
// // // //                             </div>

// // // //                             <div style={styles.formGroup}>
// // // //                                 <label>Rules (one per line)</label>
// // // //                                 <textarea
// // // //                                     value={formData.rules}
// // // //                                     onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
// // // //                                     rows="4"
// // // //                                     style={styles.textarea}
// // // //                                     placeholder="Complete daily check-in&#10;Share progress with group&#10;Support other participants"
// // // //                                 />
// // // //                             </div>

// // // //                             <div style={styles.formGroup}>
// // // //                                 <label>Daily Goal Description</label>
// // // //                                 <input
// // // //                                     type="text"
// // // //                                     value={formData.dailyGoalDescription}
// // // //                                     onChange={(e) => setFormData({ ...formData, dailyGoalDescription: e.target.value })}
// // // //                                     style={styles.input}
// // // //                                     placeholder="Write 3 gratitude entries"
// // // //                                 />
// // // //                             </div>

// // // //                             <div style={styles.formRow}>
// // // //                                 <div style={styles.formGroup}>
// // // //                                     <label>Max Participants (optional)</label>
// // // //                                     <input
// // // //                                         type="number"
// // // //                                         value={formData.maxParticipants || ""}
// // // //                                         onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
// // // //                                         style={styles.input}
// // // //                                         placeholder="Leave empty for unlimited"
// // // //                                     />
// // // //                                 </div>

// // // //                                 <div style={styles.formGroup}>
// // // //                                     <label>Reward Badge</label>
// // // //                                     <input
// // // //                                         type="text"
// // // //                                         value={formData.rewardBadge}
// // // //                                         onChange={(e) => setFormData({ ...formData, rewardBadge: e.target.value })}
// // // //                                         style={styles.input}
// // // //                                     />
// // // //                                 </div>
// // // //                             </div>

// // // //                             <div style={styles.modalActions}>
// // // //                                 <button
// // // //                                     type="button"
// // // //                                     onClick={() => {
// // // //                                         setShowCreateModal(false);
// // // //                                         resetForm();
// // // //                                     }}
// // // //                                     style={{ ...styles.modalBtn, backgroundColor: "#6c757d" }}
// // // //                                 >
// // // //                                     Cancel
// // // //                                 </button>
// // // //                                 <button
// // // //                                     type="submit"
// // // //                                     style={{ ...styles.modalBtn, backgroundColor: "#28a745" }}
// // // //                                 >
// // // //                                     Create Challenge
// // // //                                 </button>
// // // //                             </div>
// // // //                         </form>
// // // //                     </div>
// // // //                 </div>
// // // //             )}
// // // //         </div>
// // // //     );
// // // // };

// // // // const styles = {
// // // //     container: {
// // // //         padding: "20px",
// // // //         maxWidth: "1400px",
// // // //         margin: "0 auto"
// // // //     },
// // // //     header: {
// // // //         display: "flex",
// // // //         justifyContent: "space-between",
// // // //         alignItems: "center",
// // // //         marginBottom: "30px"
// // // //     },
// // // //     createBtn: {
// // // //         padding: "12px 24px",
// // // //         backgroundColor: "#28a745",
// // // //         color: "white",
// // // //         border: "none",
// // // //         borderRadius: "8px",
// // // //         cursor: "pointer",
// // // //         fontWeight: "600",
// // // //         fontSize: "16px"
// // // //     },
// // // //     grid: {
// // // //         display: "grid",
// // // //         gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
// // // //         gap: "20px"
// // // //     },
// // // //     card: {
// // // //         backgroundColor: "white",
// // // //         borderRadius: "12px",
// // // //         padding: "20px",
// // // //         boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// // // //         transition: "transform 0.2s",
// // // //         cursor: "pointer"
// // // //     },
// // // //     cardHeader: {
// // // //         display: "flex",
// // // //         justifyContent: "space-between",
// // // //         alignItems: "flex-start",
// // // //         marginBottom: "15px"
// // // //     },
// // // //     featuredBadge: {
// // // //         marginLeft: "10px",
// // // //         padding: "4px 12px",
// // // //         backgroundColor: "#fff3cd",
// // // //         borderRadius: "4px",
// // // //         fontSize: "12px",
// // // //         fontWeight: "500"
// // // //     },
// // // //     statusBadge: {
// // // //         padding: "4px 12px",
// // // //         borderRadius: "4px",
// // // //         color: "white",
// // // //         fontSize: "12px",
// // // //         fontWeight: "500"
// // // //     },
// // // //     description: {
// // // //         color: "#666",
// // // //         marginBottom: "15px",
// // // //         lineHeight: "1.5"
// // // //     },
// // // //     stats: {
// // // //         display: "grid",
// // // //         gridTemplateColumns: "repeat(3, 1fr)",
// // // //         gap: "10px",
// // // //         marginBottom: "15px"
// // // //     },
// // // //     statItem: {
// // // //         display: "flex",
// // // //         flexDirection: "column",
// // // //         padding: "10px",
// // // //         backgroundColor: "#f8f9fa",
// // // //         borderRadius: "6px",
// // // //         textAlign: "center"
// // // //     },
// // // //     cardActions: {
// // // //         display: "flex",
// // // //         gap: "10px"
// // // //     },
// // // //     actionBtn: {
// // // //         flex: 1,
// // // //         padding: "8px",
// // // //         border: "none",
// // // //         borderRadius: "6px",
// // // //         color: "white",
// // // //         cursor: "pointer",
// // // //         fontWeight: "500"
// // // //     },
// // // //     modal: {
// // // //         position: "fixed",
// // // //         top: 0,
// // // //         left: 0,
// // // //         right: 0,
// // // //         bottom: 0,
// // // //         backgroundColor: "rgba(0,0,0,0.5)",
// // // //         display: "flex",
// // // //         alignItems: "center",
// // // //         justifyContent: "center",
// // // //         zIndex: 1000
// // // //     },
// // // //     modalContent: {
// // // //         backgroundColor: "white",
// // // //         padding: "30px",
// // // //         borderRadius: "12px",
// // // //         maxWidth: "700px",
// // // //         width: "90%",
// // // //         maxHeight: "90vh",
// // // //         overflow: "auto"
// // // //     },
// // // //     form: {
// // // //         marginTop: "20px"
// // // //     },
// // // //     formGroup: {
// // // //         marginBottom: "20px"
// // // //     },
// // // //     formRow: {
// // // //         display: "grid",
// // // //         gridTemplateColumns: "1fr 1fr",
// // // //         gap: "15px"
// // // //     },
// // // //     input: {
// // // //         width: "100%",
// // // //         padding: "10px",
// // // //         border: "1px solid #ddd",
// // // //         borderRadius: "6px",
// // // //         fontSize: "14px",
// // // //         marginTop: "5px"
// // // //     },
// // // //     textarea: {
// // // //         width: "100%",
// // // //         padding: "10px",
// // // //         border: "1px solid #ddd",
// // // //         borderRadius: "6px",
// // // //         fontSize: "14px",
// // // //         marginTop: "5px",
// // // //         fontFamily: "inherit",
// // // //         resize: "vertical"
// // // //     },
// // // //     select: {
// // // //         width: "100%",
// // // //         padding: "10px",
// // // //         border: "1px solid #ddd",
// // // //         borderRadius: "6px",
// // // //         fontSize: "14px",
// // // //         marginTop: "5px"
// // // //     },
// // // //     modalActions: {
// // // //         display: "flex",
// // // //         gap: "10px",
// // // //         marginTop: "30px"
// // // //     },
// // // //     modalBtn: {
// // // //         flex: 1,
// // // //         padding: "12px",
// // // //         border: "none",
// // // //         borderRadius: "6px",
// // // //         color: "white",
// // // //         cursor: "pointer",
// // // //         fontWeight: "600",
// // // //         fontSize: "16px"
// // // //     },
// // // //     loading: {
// // // //         padding: "40px",
// // // //         textAlign: "center",
// // // //         fontSize: "18px"
// // // //     }
// // // // };

// // // // export default AdminChallengesPage;
// // // import React, { useState, useEffect } from "react";
// // // import { getToken } from "../services/auth";
// // // import { Trophy, Plus, Star, Users, Calendar, Trash2, X } from 'lucide-react';

// // // const AdminChallengesPage = () => {
// // //     const [challenges, setChallenges] = useState([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [showCreateModal, setShowCreateModal] = useState(false);
// // //     const [formData, setFormData] = useState({
// // //         title: "",
// // //         description: "",
// // //         type: "daily",
// // //         category: "habits",
// // //         icon: "🎯",
// // //         duration: 7,
// // //         startDate: "",
// // //         rules: "",
// // //         dailyGoalDescription: "",
// // //         dailyGoalTarget: 1,
// // //         maxParticipants: null,
// // //         rewardBadge: "🏆",
// // //         rewardPoints: 100,
// // //         isFeatured: false
// // //     });

// // //     useEffect(() => {
// // //         fetchChallenges();
// // //     }, []);

// // //     const fetchChallenges = async () => {
// // //         setLoading(true);
// // //         try {
// // //             const response = await fetch(
// // //                 "http://localhost:5000/api/challenges?status=all&limit=100",
// // //                 { headers: { Authorization: `Bearer ${getToken()}` } }
// // //             );
// // //             const data = await response.json();
// // //             if (!response.ok) throw new Error(data.error);
// // //             setChallenges(data.challenges || []);
// // //         } catch (err) {
// // //             alert(err.message);
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const handleCreateChallenge = async (e) => {
// // //         e.preventDefault();

// // //         const rulesArray = formData.rules
// // //             .split("\n")
// // //             .filter(rule => rule.trim())
// // //             .map(rule => rule.trim());

// // //         const challengeData = {
// // //             title: formData.title,
// // //             description: formData.description,
// // //             type: formData.type,
// // //             category: formData.category,
// // //             icon: formData.icon,
// // //             duration: parseInt(formData.duration),
// // //             startDate: formData.startDate,
// // //             rules: rulesArray,
// // //             dailyGoal: {
// // //                 description: formData.dailyGoalDescription,
// // //                 target: parseInt(formData.dailyGoalTarget)
// // //             },
// // //             maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
// // //             rewards: {
// // //                 badge: formData.rewardBadge,
// // //                 points: parseInt(formData.rewardPoints)
// // //             }
// // //         };

// // //         try {
// // //             const response = await fetch("http://localhost:5000/api/challenges", {
// // //                 method: "POST",
// // //                 headers: {
// // //                     "Content-Type": "application/json",
// // //                     Authorization: `Bearer ${getToken()}`
// // //                 },
// // //                 body: JSON.stringify(challengeData)
// // //             });

// // //             if (!response.ok) throw new Error("Failed to create challenge");

// // //             alert("Challenge created successfully!");
// // //             setShowCreateModal(false);
// // //             resetForm();
// // //             fetchChallenges();
// // //         } catch (err) {
// // //             alert(err.message);
// // //         }
// // //     };

// // //     const toggleFeatured = async (challengeId, currentStatus) => {
// // //         try {
// // //             const response = await fetch(
// // //                 `http://localhost:5000/api/challenges/${challengeId}`,
// // //                 {
// // //                     method: "PUT",
// // //                     headers: {
// // //                         "Content-Type": "application/json",
// // //                         Authorization: `Bearer ${getToken()}`
// // //                     },
// // //                     body: JSON.stringify({ isFeatured: !currentStatus })
// // //                 }
// // //             );

// // //             if (!response.ok) throw new Error("Failed to update challenge");
// // //             fetchChallenges();
// // //         } catch (err) {
// // //             alert(err.message);
// // //         }
// // //     };

// // //     const deleteChallenge = async (challengeId) => {
// // //         if (!window.confirm("Are you sure you want to delete this challenge?")) return;

// // //         try {
// // //             const response = await fetch(
// // //                 `http://localhost:5000/api/challenges/${challengeId}`,
// // //                 {
// // //                     method: "DELETE",
// // //                     headers: { Authorization: `Bearer ${getToken()}` }
// // //                 }
// // //             );

// // //             if (!response.ok) throw new Error("Failed to delete challenge");
// // //             alert("Challenge deleted successfully");
// // //             fetchChallenges();
// // //         } catch (err) {
// // //             alert(err.message);
// // //         }
// // //     };

// // //     const resetForm = () => {
// // //         setFormData({
// // //             title: "",
// // //             description: "",
// // //             type: "daily",
// // //             category: "habits",
// // //             icon: "🎯",
// // //             duration: 7,
// // //             startDate: "",
// // //             rules: "",
// // //             dailyGoalDescription: "",
// // //             dailyGoalTarget: 1,
// // //             maxParticipants: null,
// // //             rewardBadge: "🏆",
// // //             rewardPoints: 100,
// // //             isFeatured: false
// // //         });
// // //     };

// // //     const getChallengeStatus = (challenge) => {
// // //         const now = new Date();
// // //         const start = new Date(challenge.startDate);
// // //         const end = new Date(challenge.endDate);

// // //         if (now < start) return { label: "Upcoming", color: "from-blue-500 to-blue-600" };
// // //         if (now > end) return { label: "Ended", color: "from-gray-500 to-gray-600" };
// // //         return { label: "Active", color: "from-green-500 to-green-600" };
// // //     };

// // //     if (loading) {
// // //         return (
// // //             <div className="flex justify-center items-center py-12">
// // //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
// // //             </div>
// // //         );
// // //     }

// // //     return (
// // //         <div>
// // //             {/* Header */}
// // //             <div className="flex justify-between items-center mb-6">
// // //                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
// // //                     <Trophy className="w-7 h-7 text-yellow-500" />
// // //                     Challenge Management
// // //                 </h2>
// // //                 <button
// // //                     onClick={() => setShowCreateModal(true)}
// // //                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
// // //                 >
// // //                     <Plus className="w-5 h-5" />
// // //                     Create Challenge
// // //                 </button>
// // //             </div>

// // //             {/* Challenges Grid */}
// // //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //                 {challenges.map(challenge => {
// // //                     const status = getChallengeStatus(challenge);
// // //                     return (
// // //                         <div key={challenge._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all">
// // //                             {/* Header */}
// // //                             <div className="flex justify-between items-start mb-4">
// // //                                 <div className="flex items-center gap-3">
// // //                                     <span className="text-4xl">{challenge.icon}</span>
// // //                                     {challenge.isFeatured && (
// // //                                         <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1">
// // //                                             <Star className="w-3 h-3" fill="currentColor" />
// // //                                             Featured
// // //                                         </span>
// // //                                     )}
// // //                                 </div>
// // //                                 <span className={`px-3 py-1 bg-gradient-to-r ${status.color} text-white rounded-full text-xs font-bold`}>
// // //                                     {status.label}
// // //                                 </span>
// // //                             </div>

// // //                             {/* Content */}
// // //                             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Brasika" }}>
// // //                                 {challenge.title}
// // //                             </h3>
// // //                             <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
// // //                                 {challenge.description}
// // //                             </p>

// // //                             {/* Stats */}
// // //                             <div className="grid grid-cols-3 gap-3 mb-4">
// // //                                 <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
// // //                                     <Calendar className="w-4 h-4 mx-auto mb-1 text-[#f4873e]" />
// // //                                     <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
// // //                                     <p className="font-bold text-gray-900 dark:text-white">{challenge.duration}d</p>
// // //                                 </div>
// // //                                 <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
// // //                                     <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
// // //                                     <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
// // //                                     <p className="font-bold text-gray-900 dark:text-white">{challenge.participantCount || 0}</p>
// // //                                 </div>
// // //                                 <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
// // //                                     <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
// // //                                     <p className="text-xs text-gray-600 dark:text-gray-400">Complete</p>
// // //                                     <p className="font-bold text-gray-900 dark:text-white">{challenge.completionRate || 0}%</p>
// // //                                 </div>
// // //                             </div>

// // //                             {/* Actions */}
// // //                             <div className="flex gap-2">
// // //                                 <button
// // //                                     onClick={() => toggleFeatured(challenge._id, challenge.isFeatured)}
// // //                                     className={`
// // //                                         flex-1 py-2 rounded-full font-bold text-white transition-all hover:shadow-md
// // //                                         ${challenge.isFeatured
// // //                                             ? 'bg-gradient-to-r from-gray-500 to-gray-600'
// // //                                             : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
// // //                                         }
// // //                                     `}
// // //                                 >
// // //                                     {challenge.isFeatured ? "Unfeature" : "Feature"}
// // //                                 </button>
// // //                                 <button
// // //                                     onClick={() => deleteChallenge(challenge._id)}
// // //                                     className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold hover:shadow-md transition-all"
// // //                                 >
// // //                                     <Trash2 className="w-4 h-4" />
// // //                                 </button>
// // //                             </div>
// // //                         </div>
// // //                     );
// // //                 })}
// // //             </div>

// // //             {/* Create Challenge Modal */}
// // //             {showCreateModal && (
// // //                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
// // //                     <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
// // //                         {/* Modal Header */}
// // //                         <div className="flex justify-between items-center mb-6">
// // //                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
// // //                                 Create New Challenge
// // //                             </h2>
// // //                             <button
// // //                                 onClick={() => {
// // //                                     setShowCreateModal(false);
// // //                                     resetForm();
// // //                                 }}
// // //                                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
// // //                             >
// // //                                 <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
// // //                             </button>
// // //                         </div>

// // //                         {/* Form */}
// // //                         <form onSubmit={handleCreateChallenge} className="space-y-6">
// // //                             {/* Title */}
// // //                             <div>
// // //                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
// // //                                 <input
// // //                                     type="text"
// // //                                     value={formData.title}
// // //                                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// // //                                     required
// // //                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                     placeholder="e.g., 7-Day Gratitude Challenge"
// // //                                 />
// // //                             </div>

// // //                             {/* Description */}
// // //                             <div>
// // //                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
// // //                                 <textarea
// // //                                     value={formData.description}
// // //                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // //                                     required
// // //                                     rows="3"
// // //                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] resize-none"
// // //                                     placeholder="Describe the challenge..."
// // //                                 />
// // //                             </div>

// // //                             {/* Type & Category */}
// // //                             <div className="grid grid-cols-2 gap-4">
// // //                                 <div>
// // //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
// // //                                     <select
// // //                                         value={formData.type}
// // //                                         onChange={(e) => setFormData({ ...formData, type: e.target.value })}
// // //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                     >
// // //                                         <option value="daily">Daily</option>
// // //                                         <option value="weekly">Weekly</option>
// // //                                         <option value="custom">Custom</option>
// // //                                     </select>
// // //                                 </div>

// // //                                 <div>
// // //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
// // //                                     <select
// // //                                         value={formData.category}
// // //                                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
// // //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                     >
// // //                                         <option value="habits">Habits</option>
// // //                                         <option value="gratitude">Gratitude</option>
// // //                                         <option value="mindfulness">Mindfulness</option>
// // //                                         <option value="fitness">Fitness</option>
// // //                                         <option value="journaling">Journaling</option>
// // //                                         <option value="wellness">Wellness</option>
// // //                                         <option value="digital-detox">Digital Detox</option>
// // //                                     </select>
// // //                                 </div>
// // //                             </div>

// // //                             {/* Icon & Duration */}
// // //                             <div className="grid grid-cols-2 gap-4">
// // //                                 <div>
// // //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Icon (emoji)</label>
// // //                                     <input
// // //                                         type="text"
// // //                                         value={formData.icon}
// // //                                         onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
// // //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                         placeholder="🎯"
// // //                                     />
// // //                                 </div>

// // //                                 <div>
// // //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration (days)</label>
// // //                                     <input
// // //                                         type="number"
// // //                                         value={formData.duration}
// // //                                         onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
// // //                                         required
// // //                                         min="1"
// // //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                     />
// // //                                 </div>
// // //                             </div>

// // //                             {/* Start Date */}
// // //                             <div>
// // //                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Start Date *</label>
// // //                                 <input
// // //                                     type="date"
// // //                                     value={formData.startDate}
// // //                                     onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
// // //                                     required
// // //                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                 />
// // //                             </div>

// // //                             {/* Rules */}
// // //                             <div>
// // //                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rules (one per line)</label>
// // //                                 <textarea
// // //                                     value={formData.rules}
// // //                                     onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
// // //                                     rows="4"
// // //                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] resize-none"
// // //                                     placeholder="Complete daily check-in&#10;Share progress with group&#10;Support other participants"
// // //                                 />
// // //                             </div>

// // //                             {/* Daily Goal */}
// // //                             <div>
// // //                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Daily Goal Description</label>
// // //                                 <input
// // //                                     type="text"
// // //                                     value={formData.dailyGoalDescription}
// // //                                     onChange={(e) => setFormData({ ...formData, dailyGoalDescription: e.target.value })}
// // //                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                     placeholder="Write 3 gratitude entries"
// // //                                 />
// // //                             </div>

// // //                             {/* Max Participants & Reward */}
// // //                             <div className="grid grid-cols-2 gap-4">
// // //                                 <div>
// // //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max Participants</label>
// // //                                     <input
// // //                                         type="number"
// // //                                         value={formData.maxParticipants || ""}
// // //                                         onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
// // //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                         placeholder="Unlimited"
// // //                                     />
// // //                                 </div>

// // //                                 <div>
// // //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reward Badge</label>
// // //                                     <input
// // //                                         type="text"
// // //                                         value={formData.rewardBadge}
// // //                                         onChange={(e) => setFormData({ ...formData, rewardBadge: e.target.value })}
// // //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// // //                                     />
// // //                                 </div>
// // //                             </div>

// // //                             {/* Action Buttons */}
// // //                             <div className="flex gap-4 pt-4">
// // //                                 <button
// // //                                     type="button"
// // //                                     onClick={() => {
// // //                                         setShowCreateModal(false);
// // //                                         resetForm();
// // //                                     }}
// // //                                     className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
// // //                                 >
// // //                                     Cancel
// // //                                 </button>
// // //                                 <button
// // //                                     type="submit"
// // //                                     className="flex-1 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
// // //                                 >
// // //                                     Create Challenge
// // //                                 </button>
// // //                             </div>
// // //                         </form>
// // //                     </div>
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default AdminChallengesPage;
// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { getToken } from "../services/auth";
// // import { Trophy, Plus, Star, Users, Calendar, Trash2, X, Menu } from 'lucide-react';
// // import AdminSidebar from "../components/AdminSidebar";
// // import NotificationBell from '../components/NotificationBell';

// // const AdminChallengesPage = () => {
// //     const navigate = useNavigate();
// //     const [challenges, setChallenges] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [showCreateModal, setShowCreateModal] = useState(false);
// //     const [formData, setFormData] = useState({
// //         title: "",
// //         description: "",
// //         type: "daily",
// //         category: "habits",
// //         icon: "🎯",
// //         duration: 7,
// //         startDate: "",
// //         rules: "",
// //         dailyGoalDescription: "",
// //         dailyGoalTarget: 1,
// //         maxParticipants: null,
// //         rewardBadge: "🏆",
// //         rewardPoints: 100,
// //         isFeatured: false
// //     });

// //     useEffect(() => {
// //         fetchChallenges();
// //     }, []);

// //     const fetchChallenges = async () => {
// //         setLoading(true);
// //         try {
// //             const response = await fetch(
// //                 "http://localhost:5000/api/challenges?status=all&limit=100",
// //                 { headers: { Authorization: `Bearer ${getToken()}` } }
// //             );
// //             const data = await response.json();
// //             if (!response.ok) throw new Error(data.error);
// //             setChallenges(data.challenges || []);
// //         } catch (err) {
// //             alert(err.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleCreateChallenge = async (e) => {
// //         e.preventDefault();

// //         const rulesArray = formData.rules
// //             .split("\n")
// //             .filter(rule => rule.trim())
// //             .map(rule => rule.trim());

// //         const challengeData = {
// //             title: formData.title,
// //             description: formData.description,
// //             type: formData.type,
// //             category: formData.category,
// //             icon: formData.icon,
// //             duration: parseInt(formData.duration),
// //             startDate: formData.startDate,
// //             rules: rulesArray,
// //             dailyGoal: {
// //                 description: formData.dailyGoalDescription,
// //                 target: parseInt(formData.dailyGoalTarget)
// //             },
// //             maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
// //             rewards: {
// //                 badge: formData.rewardBadge,
// //                 points: parseInt(formData.rewardPoints)
// //             }
// //         };

// //         try {
// //             const response = await fetch("http://localhost:5000/api/challenges", {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${getToken()}`
// //                 },
// //                 body: JSON.stringify(challengeData)
// //             });

// //             if (!response.ok) throw new Error("Failed to create challenge");

// //             alert("Challenge created successfully!");
// //             setShowCreateModal(false);
// //             resetForm();
// //             fetchChallenges();
// //         } catch (err) {
// //             alert(err.message);
// //         }
// //     };

// //     const toggleFeatured = async (challengeId, currentStatus) => {
// //         try {
// //             const response = await fetch(
// //                 `http://localhost:5000/api/challenges/${challengeId}`,
// //                 {
// //                     method: "PUT",
// //                     headers: {
// //                         "Content-Type": "application/json",
// //                         Authorization: `Bearer ${getToken()}`
// //                     },
// //                     body: JSON.stringify({ isFeatured: !currentStatus })
// //                 }
// //             );

// //             if (!response.ok) throw new Error("Failed to update challenge");
// //             fetchChallenges();
// //         } catch (err) {
// //             alert(err.message);
// //         }
// //     };

// //     const deleteChallenge = async (challengeId) => {
// //         if (!window.confirm("Are you sure you want to delete this challenge?")) return;

// //         try {
// //             const response = await fetch(
// //                 `http://localhost:5000/api/challenges/${challengeId}`,
// //                 {
// //                     method: "DELETE",
// //                     headers: { Authorization: `Bearer ${getToken()}` }
// //                 }
// //             );

// //             if (!response.ok) throw new Error("Failed to delete challenge");
// //             alert("Challenge deleted successfully");
// //             fetchChallenges();
// //         } catch (err) {
// //             alert(err.message);
// //         }
// //     };

// //     const resetForm = () => {
// //         setFormData({
// //             title: "",
// //             description: "",
// //             type: "daily",
// //             category: "habits",
// //             icon: "🎯",
// //             duration: 7,
// //             startDate: "",
// //             rules: "",
// //             dailyGoalDescription: "",
// //             dailyGoalTarget: 1,
// //             maxParticipants: null,
// //             rewardBadge: "🏆",
// //             rewardPoints: 100,
// //             isFeatured: false
// //         });
// //     };

// //     const getChallengeStatus = (challenge) => {
// //         const now = new Date();
// //         const start = new Date(challenge.startDate);
// //         const end = new Date(challenge.endDate);

// //         if (now < start) return { label: "Upcoming", color: "from-blue-500 to-blue-600" };
// //         if (now > end) return { label: "Ended", color: "from-gray-500 to-gray-600" };
// //         return { label: "Active", color: "from-green-500 to-green-600" };
// //     };

// //     if (loading) {
// //         return (
// //             <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
// //                 <AdminSidebar />
// //                 <div className="flex-1 ml-28 flex justify-center items-center">
// //                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
// //             {/* LEFT SIDEBAR */}
// //             <AdminSidebar />

// //             {/* MAIN CENTER PANEL */}
// //             <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

// //                 {/* Header */}
// //                 <div className="flex justify-between items-center mb-6">
// //                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
// //                         <Trophy className="w-7 h-7 text-yellow-500" />
// //                         Challenge Management
// //                     </h2>
// //                     <button
// //                         onClick={() => setShowCreateModal(true)}
// //                         className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
// //                     >
// //                         <Plus className="w-5 h-5" />
// //                         Create Challenge
// //                     </button>
// //                 </div>

// //                 {/* Challenges Grid */}
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                     {challenges.map(challenge => {
// //                         const status = getChallengeStatus(challenge);
// //                         return (
// //                             <div key={challenge._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all">
// //                                 <div className="flex justify-between items-start mb-4">
// //                                     <div className="flex items-center gap-3">
// //                                         <span className="text-4xl">{challenge.icon}</span>
// //                                         {challenge.isFeatured && (
// //                                             <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1">
// //                                                 <Star className="w-3 h-3" fill="currentColor" />
// //                                                 Featured
// //                                             </span>
// //                                         )}
// //                                     </div>
// //                                     <span className={`px-3 py-1 bg-gradient-to-r ${status.color} text-white rounded-full text-xs font-bold`}>
// //                                         {status.label}
// //                                     </span>
// //                                 </div>

// //                                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "Brasika" }}>
// //                                     {challenge.title}
// //                                 </h3>
// //                                 <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
// //                                     {challenge.description}
// //                                 </p>

// //                                 <div className="grid grid-cols-3 gap-3 mb-4">
// //                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
// //                                         <Calendar className="w-4 h-4 mx-auto mb-1 text-[#f4873e]" />
// //                                         <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
// //                                         <p className="font-bold text-gray-900 dark:text-white">{challenge.duration}d</p>
// //                                     </div>
// //                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
// //                                         <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
// //                                         <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
// //                                         <p className="font-bold text-gray-900 dark:text-white">{challenge.participantCount || 0}</p>
// //                                     </div>
// //                                     <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
// //                                         <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
// //                                         <p className="text-xs text-gray-600 dark:text-gray-400">Complete</p>
// //                                         <p className="font-bold text-gray-900 dark:text-white">{challenge.completionRate || 0}%</p>
// //                                     </div>
// //                                 </div>

// //                                 <div className="flex gap-2">
// //                                     <button
// //                                         onClick={() => toggleFeatured(challenge._id, challenge.isFeatured)}
// //                                         className={`
// //                                             flex-1 py-2 rounded-full font-bold text-white transition-all hover:shadow-md
// //                                             ${challenge.isFeatured
// //                                                 ? 'bg-gradient-to-r from-gray-500 to-gray-600'
// //                                                 : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
// //                                             }
// //                                         `}
// //                                     >
// //                                         {challenge.isFeatured ? "Unfeature" : "Feature"}
// //                                     </button>
// //                                     <button
// //                                         onClick={() => deleteChallenge(challenge._id)}
// //                                         className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold hover:shadow-md transition-all"
// //                                     >
// //                                         <Trash2 className="w-4 h-4" />
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         );
// //                     })}
// //                 </div>

// //                 {/* Create Challenge Modal */}
// //                 {showCreateModal && (
// //                     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
// //                         <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
// //                             <div className="flex justify-between items-center mb-6">
// //                                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
// //                                     Create New Challenge
// //                                 </h2>
// //                                 <button
// //                                     onClick={() => {
// //                                         setShowCreateModal(false);
// //                                         resetForm();
// //                                     }}
// //                                     className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
// //                                 >
// //                                     <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
// //                                 </button>
// //                             </div>

// //                             <form onSubmit={handleCreateChallenge} className="space-y-6">
// //                                 <div>
// //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
// //                                     <input
// //                                         type="text"
// //                                         value={formData.title}
// //                                         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// //                                         required
// //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                         placeholder="e.g., 7-Day Gratitude Challenge"
// //                                     />
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
// //                                     <textarea
// //                                         value={formData.description}
// //                                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// //                                         required
// //                                         rows="3"
// //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] resize-none"
// //                                         placeholder="Describe the challenge..."
// //                                     />
// //                                 </div>

// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
// //                                         <select
// //                                             value={formData.type}
// //                                             onChange={(e) => setFormData({ ...formData, type: e.target.value })}
// //                                             className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                         >
// //                                             <option value="daily">Daily</option>
// //                                             <option value="weekly">Weekly</option>
// //                                             <option value="custom">Custom</option>
// //                                         </select>
// //                                     </div>

// //                                     <div>
// //                                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
// //                                         <select
// //                                             value={formData.category}
// //                                             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
// //                                             className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                         >
// //                                             <option value="habits">Habits</option>
// //                                             <option value="gratitude">Gratitude</option>
// //                                             <option value="mindfulness">Mindfulness</option>
// //                                             <option value="fitness">Fitness</option>
// //                                             <option value="journaling">Journaling</option>
// //                                             <option value="wellness">Wellness</option>
// //                                             <option value="digital-detox">Digital Detox</option>
// //                                         </select>
// //                                     </div>
// //                                 </div>

// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Icon (emoji)</label>
// //                                         <input
// //                                             type="text"
// //                                             value={formData.icon}
// //                                             onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
// //                                             className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                             placeholder="🎯"
// //                                         />
// //                                     </div>

// //                                     <div>
// //                                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration (days)</label>
// //                                         <input
// //                                             type="number"
// //                                             value={formData.duration}
// //                                             onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
// //                                             required
// //                                             min="1"
// //                                             className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Start Date *</label>
// //                                     <input
// //                                         type="date"
// //                                         value={formData.startDate}
// //                                         onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
// //                                         required
// //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                     />
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rules (one per line)</label>
// //                                     <textarea
// //                                         value={formData.rules}
// //                                         onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
// //                                         rows="4"
// //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] resize-none"
// //                                         placeholder="Complete daily check-in&#10;Share progress with group&#10;Support other participants"
// //                                     />
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Daily Goal Description</label>
// //                                     <input
// //                                         type="text"
// //                                         value={formData.dailyGoalDescription}
// //                                         onChange={(e) => setFormData({ ...formData, dailyGoalDescription: e.target.value })}
// //                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                         placeholder="Write 3 gratitude entries"
// //                                     />
// //                                 </div>

// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max Participants</label>
// //                                         <input
// //                                             type="number"
// //                                             value={formData.maxParticipants || ""}
// //                                             onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
// //                                             className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                             placeholder="Unlimited"
// //                                         />
// //                                     </div>

// //                                     <div>
// //                                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reward Badge</label>
// //                                         <input
// //                                             type="text"
// //                                             value={formData.rewardBadge}
// //                                             onChange={(e) => setFormData({ ...formData, rewardBadge: e.target.value })}
// //                                             className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div className="flex gap-4 pt-4">
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => {
// //                                             setShowCreateModal(false);
// //                                             resetForm();
// //                                         }}
// //                                         className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
// //                                     >
// //                                         Cancel
// //                                     </button>
// //                                     <button
// //                                         type="submit"
// //                                         className="flex-1 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
// //                                     >
// //                                         Create Challenge
// //                                     </button>
// //                                 </div>
// //                             </form>
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>

// //             {/* Top Right Navigation */}
// //             {/* <div className="absolute top-6 right-6 flex items-center gap-6">
// //                 <NotificationBell />
// //                 <button
// //                     onClick={() => navigate('/settings')}
// //                     className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
// //                 >
// //                     <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
// //                 </button>
// //             </div> */}
// //         </div>
// //     );
// // };

// // export default AdminChallengesPage;
// import React, { useState, useEffect } from "react";
// import { getToken } from "../services/auth";
// import { Trophy, Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

// const AdminChallengesPage = () => {
//     const [activeTab, setActiveTab] = useState("templates");
//     const [templates, setTemplates] = useState([]);
//     const [liveChallenges, setLiveChallenges] = useState([]);
//     const [eligibleCount, setEligibleCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [editingTemplate, setEditingTemplate] = useState(null);
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         trackingType: "mood",
//         duration: 7,
//         difficulty: "easy",
//         status: "active"
//     });

//     useEffect(() => {
//         fetchTemplates();
//         fetchLiveChallenges();
//     }, []);

//     const fetchTemplates = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch("http://localhost:5000/api/challenges/admin/templates", {
//                 headers: { Authorization: `Bearer ${getToken()}` }
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error);
//             setTemplates(data.templates || []);
//             setEligibleCount(data.eligibleCount || 0);
//         } catch (err) {
//             alert(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchLiveChallenges = async () => {
//         try {
//             const res = await fetch("http://localhost:5000/api/challenges", {
//                 headers: { Authorization: `Bearer ${getToken()}` }
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error);
//             setLiveChallenges(data.challenges || []);
//         } catch (err) {
//             console.error("Error fetching live challenges:", err);
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             title: "",
//             description: "",
//             trackingType: "mood",
//             duration: 7,
//             difficulty: "easy",
//             status: "active"
//         });
//         setEditingTemplate(null);
//     };

//     const handleOpenEdit = (template) => {
//         setEditingTemplate(template);
//         setFormData({
//             title: template.title,
//             description: template.description,
//             trackingType: template.trackingType,
//             duration: template.duration,
//             difficulty: template.difficulty,
//             status: template.status
//         });
//         setShowCreateModal(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const url = editingTemplate
//             ? `http://localhost:5000/api/challenges/admin/templates/${editingTemplate._id}`
//             : "http://localhost:5000/api/challenges/admin/templates";
//         const method = editingTemplate ? "PATCH" : "POST";

//         try {
//             const res = await fetch(url, {
//                 method,
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getToken()}`
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error);
//             alert(editingTemplate ? "Template updated!" : "Template created!");
//             setShowCreateModal(false);
//             resetForm();
//             fetchTemplates();
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this template?")) return;
//         try {
//             const res = await fetch(`http://localhost:5000/api/challenges/admin/templates/${id}`, {
//                 method: "DELETE",
//                 headers: { Authorization: `Bearer ${getToken()}` }
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error);
//             alert("Template deleted");
//             fetchTemplates();
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const trackingTypeColors = {
//         mood: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
//         habit: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
//         journal: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
//         manual: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
//     };

//     const difficultyColors = {
//         easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
//         medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
//         hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
//     };

//     return (
//         <div>
//             {/* Low pool warning */}
//             {eligibleCount <= 2 && (
//                 <div className="flex items-center gap-3 p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl">
//                     <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
//                     <p className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">
//                         Only {eligibleCount} eligible template(s) available. Add more templates to keep challenges running automatically.
//                     </p>
//                 </div>
//             )}

//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
//                     <Trophy className="w-7 h-7 text-yellow-500" />
//                     Challenge Management
//                 </h2>
//                 {activeTab === "templates" && (
//                     <button
//                         onClick={() => { resetForm(); setShowCreateModal(true); }}
//                         className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
//                     >
//                         <Plus className="w-5 h-5" />
//                         New Template
//                     </button>
//                 )}
//             </div>

//             {/* Tabs */}
//             <div className="flex gap-3 mb-6">
//                 {[
//                     { id: "templates", label: "Templates" },
//                     { id: "live", label: "Live Challenges" }
//                 ].map(tab => (
//                     <button
//                         key={tab.id}
//                         onClick={() => setActiveTab(tab.id)}
//                         className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === tab.id
//                                 ? "bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white shadow-lg"
//                                 : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                             }`}
//                     >
//                         {tab.label}
//                     </button>
//                 ))}
//             </div>

//             {/* Templates Tab */}
//             {activeTab === "templates" && (
//                 loading ? (
//                     <div className="flex justify-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]" />
//                     </div>
//                 ) : templates.length === 0 ? (
//                     <div className="text-center py-12">
//                         <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
//                         <p className="text-gray-500 dark:text-gray-400">No templates yet. Create your first one.</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {templates.map(template => (
//                             <div key={template._id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600">
//                                 <div className="flex justify-between items-start mb-3">
//                                     <div className="flex gap-2 flex-wrap">
//                                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${trackingTypeColors[template.trackingType]}`}>
//                                             {template.trackingType}
//                                         </span>
//                                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${difficultyColors[template.difficulty]}`}>
//                                             {template.difficulty}
//                                         </span>
//                                         {!template.isEligible && (
//                                             <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
//                                                 On cooldown
//                                             </span>
//                                         )}
//                                     </div>
//                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${template.status === "active"
//                                             ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
//                                             : "bg-gray-200 dark:bg-gray-600 text-gray-500"
//                                         }`}>
//                                         {template.status}
//                                     </span>
//                                 </div>

//                                 <h3 className="font-bold text-gray-900 dark:text-white mb-1">{template.title}</h3>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{template.description}</p>

//                                 <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
//                                     <span>{template.duration} days</span>
//                                     <span>
//                                         {template.lastUsedAt
//                                             ? `Last used: ${new Date(template.lastUsedAt).toLocaleDateString()}`
//                                             : "Never used"}
//                                     </span>
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={() => handleOpenEdit(template)}
//                                         className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-bold text-sm hover:shadow-md transition-all"
//                                     >
//                                         <Edit2 className="w-3 h-3" /> Edit
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(template._id)}
//                                         className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-bold text-sm hover:shadow-md transition-all"
//                                     >
//                                         <Trash2 className="w-3 h-3" /> Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )
//             )}

//             {/* Live Challenges Tab */}
//             {activeTab === "live" && (
//                 liveChallenges.length === 0 ? (
//                     <div className="text-center py-12">
//                         <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
//                         <p className="text-gray-500 dark:text-gray-400">No active challenges right now. Agenda will create one next Monday.</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {liveChallenges.map(challenge => (
//                             <div key={challenge._id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600">
//                                 <div className="flex justify-between items-start mb-3">
//                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${trackingTypeColors[challenge.trackingType]}`}>
//                                         {challenge.trackingType}
//                                     </span>
//                                     <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
//                                         Active
//                                     </span>
//                                 </div>
//                                 <h3 className="font-bold text-gray-900 dark:text-white mb-1">{challenge.title}</h3>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{challenge.description}</p>
//                                 <div className="grid grid-cols-3 gap-2 text-center text-sm">
//                                     <div className="bg-white dark:bg-gray-600 rounded-xl p-2">
//                                         <p className="font-bold text-gray-900 dark:text-white">{challenge.participantCount}</p>
//                                         <p className="text-xs text-gray-500 dark:text-gray-400">Participants</p>
//                                     </div>
//                                     <div className="bg-white dark:bg-gray-600 rounded-xl p-2">
//                                         <p className="font-bold text-gray-900 dark:text-white">{challenge.duration}d</p>
//                                         <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
//                                     </div>
//                                     <div className="bg-white dark:bg-gray-600 rounded-xl p-2">
//                                         <p className="font-bold text-gray-900 dark:text-white">
//                                             {Math.max(0, Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)))}d
//                                         </p>
//                                         <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )
//             )}

//             {/* Create / Edit Modal */}
//             {showCreateModal && (
//                 <div
//                     className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//                     onClick={() => { setShowCreateModal(false); resetForm(); }}
//                 >
//                     <div
//                         className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="flex justify-between items-center mb-6">
//                             <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                                 {editingTemplate ? "Edit Template" : "New Template"}
//                             </h2>
//                             <button onClick={() => { setShowCreateModal(false); resetForm(); }}>
//                                 <X className="w-6 h-6 text-gray-500" />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title *</label>
//                                 <input
//                                     type="text"
//                                     required
//                                     value={formData.title}
//                                     onChange={e => setFormData({ ...formData, title: e.target.value })}
//                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
//                                     placeholder="e.g., 7 Day Mood Streak"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description *</label>
//                                 <textarea
//                                     required
//                                     rows="3"
//                                     value={formData.description}
//                                     onChange={e => setFormData({ ...formData, description: e.target.value })}
//                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] resize-none"
//                                     placeholder="Describe the challenge..."
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tracking Type *</label>
//                                 <select
//                                     value={formData.trackingType}
//                                     onChange={e => setFormData({ ...formData, trackingType: e.target.value })}
//                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
//                                 >
//                                     <option value="mood">Mood (auto tracked)</option>
//                                     <option value="habit">Habit (auto tracked)</option>
//                                     <option value="journal">Journal (auto tracked)</option>
//                                     <option value="manual">Manual (user taps done)</option>
//                                 </select>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                     {formData.trackingType === "manual"
//                                         ? "User must manually mark each day as done"
//                                         : `Progress tracked automatically from user's ${formData.trackingType} activity`}
//                                 </p>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (days) *</label>
//                                     <input
//                                         type="number"
//                                         required
//                                         min="1"
//                                         value={formData.duration}
//                                         onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
//                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Difficulty *</label>
//                                     <select
//                                         value={formData.difficulty}
//                                         onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
//                                         className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
//                                     >
//                                         <option value="easy">Easy</option>
//                                         <option value="medium">Medium</option>
//                                         <option value="hard">Hard</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Status</label>
//                                 <select
//                                     value={formData.status}
//                                     onChange={e => setFormData({ ...formData, status: e.target.value })}
//                                     className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
//                                 >
//                                     <option value="active">Active (eligible for scheduling)</option>
//                                     <option value="inactive">Inactive (excluded from scheduling)</option>
//                                 </select>
//                             </div>

//                             <div className="flex gap-4 pt-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => { setShowCreateModal(false); resetForm(); }}
//                                     className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="flex-1 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
//                                 >
//                                     {editingTemplate ? "Update" : "Create"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminChallengesPage;
import React, { useState, useEffect } from "react";
import { getToken } from "../services/auth";
import { Trophy, Plus, Edit2, Trash2, X, AlertTriangle, Users, Calendar } from 'lucide-react';
import AdminSidebar from "../components/AdminSidebar";

const AdminChallengesPage = () => {
    const [activeTab, setActiveTab] = useState("templates");
    const [templates, setTemplates] = useState([]);
    const [liveChallenges, setLiveChallenges] = useState([]);
    const [eligibleCount, setEligibleCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        trackingType: "mood",
        duration: 7,
        difficulty: "easy",
        status: "active"
    });

    useEffect(() => {
        fetchTemplates();
        fetchLiveChallenges();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/challenges/admin/templates", {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setTemplates(data.templates || []);
            setEligibleCount(data.eligibleCount || 0);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveChallenges = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/challenges", {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setLiveChallenges(data.challenges || []);
        } catch (err) {
            console.error("Error fetching live challenges:", err);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            trackingType: "mood",
            duration: 7,
            difficulty: "easy",
            status: "active"
        });
        setEditingTemplate(null);
    };

    const handleOpenEdit = (template) => {
        setEditingTemplate(template);
        setFormData({
            title: template.title,
            description: template.description,
            trackingType: template.trackingType,
            duration: template.duration,
            difficulty: template.difficulty,
            status: template.status
        });
        setShowCreateModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingTemplate
            ? `http://localhost:5000/api/challenges/admin/templates/${editingTemplate._id}`
            : "http://localhost:5000/api/challenges/admin/templates";
        const method = editingTemplate ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            alert(editingTemplate ? "Template updated!" : "Template created!");
            setShowCreateModal(false);
            resetForm();
            fetchTemplates();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this template?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/challenges/admin/templates/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            alert("Template deleted");
            fetchTemplates();
        } catch (err) {
            alert(err.message);
        }
    };

    const trackingTypeColors = {
        mood: "from-purple-500 to-purple-600",
        habit: "from-blue-500 to-blue-600",
        journal: "from-green-500 to-green-600",
        manual: "from-orange-500 to-orange-600"
    };

    const difficultyColors = {
        easy: "from-green-500 to-green-600",
        medium: "from-yellow-500 to-yellow-600",
        hard: "from-red-500 to-red-600"
    };

    const trackingTypeIcons = {
        mood: "😊",
        habit: "✅",
        journal: "📝",
        manual: "👆"
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
                <AdminSidebar />
                <div className="flex-1 ml-28 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            {/* LEFT SIDEBAR */}
            <AdminSidebar />

            {/* MAIN CENTER PANEL */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                {/* Low pool warning */}
                {eligibleCount <= 2 && (
                    <div className="flex items-center gap-3 p-4 mb-6 bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-3xl">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <p className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">
                            Only {eligibleCount} eligible template(s) available. Add more templates to keep challenges running automatically.
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
                        <Trophy className="w-7 h-7 text-[#f4873e]" />
                        Challenge Management
                    </h2>
                    {activeTab === "templates" && (
                        <button
                            onClick={() => { resetForm(); setShowCreateModal(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Template
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                    {[
                        { id: "templates", label: "Templates" },
                        { id: "live", label: "Live Challenges" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white shadow-lg scale-105"
                                    : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-102 hover:shadow-md"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Templates Tab */}
                {activeTab === "templates" && (
                    templates.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400">No templates yet. Create your first one.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map(template => (
                                <div key={template._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all">

                                    {/* Icon + badges row */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-4xl">{trackingTypeIcons[template.trackingType]}</span>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                                {template.title}
                                            </h3>
                                            <div className="flex gap-2 mt-1 flex-wrap">
                                                <span className={`inline-block px-3 py-1 bg-gradient-to-r ${trackingTypeColors[template.trackingType]} text-white rounded-full text-xs font-bold`}>
                                                    {template.trackingType}
                                                </span>
                                                <span className={`inline-block px-3 py-1 bg-gradient-to-r ${difficultyColors[template.difficulty]} text-white rounded-full text-xs font-bold`}>
                                                    {template.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {template.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Calendar className="w-4 h-4 mx-auto mb-1 text-[#f4873e]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{template.duration}d</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <div className={`w-3 h-3 mx-auto mb-1 rounded-full ${template.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                                            <p className={`font-bold text-xs ${template.status === "active" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                                                {template.status}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Eligible</p>
                                            <p className={`font-bold text-xs ${template.isEligible ? "text-green-600 dark:text-green-400" : "text-orange-500"}`}>
                                                {template.isEligible ? "Yes" : "Cooldown"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Last used */}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                        {template.lastUsedAt
                                            ? `Last used: ${new Date(template.lastUsedAt).toLocaleDateString()}`
                                            : "Never used"}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(template)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:shadow-md transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(template._id)}
                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold hover:shadow-md transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Live Challenges Tab */}
                {activeTab === "live" && (
                    liveChallenges.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400">No active challenges right now.</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Agenda will create one next Sunday at 8am.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveChallenges.map(challenge => (
                                <div key={challenge._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all">

                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-4xl">{trackingTypeIcons[challenge.trackingType]}</span>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                                {challenge.title}
                                            </h3>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`inline-block px-3 py-1 bg-gradient-to-r ${trackingTypeColors[challenge.trackingType]} text-white rounded-full text-xs font-bold`}>
                                                    {challenge.trackingType}
                                                </span>
                                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {challenge.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{challenge.participantCount}</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Calendar className="w-4 h-4 mx-auto mb-1 text-[#f4873e]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{challenge.duration}d</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Left</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {Math.max(0, Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)))}d
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Ends: {new Date(challenge.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Create / Edit Modal */}
                {showCreateModal && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => { setShowCreateModal(false); resetForm(); }}
                    >
                        <div
                            className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                    {editingTemplate ? "Edit Template" : "Create New Template"}
                                </h2>
                                <button
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
                                        placeholder="e.g., 7 Day Mood Streak"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] resize-none"
                                        placeholder="Describe the challenge..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tracking Type *</label>
                                    <select
                                        value={formData.trackingType}
                                        onChange={e => setFormData({ ...formData, trackingType: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
                                    >
                                        <option value="mood">😊 Mood (auto tracked)</option>
                                        <option value="habit">✅ Habit (auto tracked)</option>
                                        <option value="journal">📝 Journal (auto tracked)</option>
                                        <option value="manual">👆 Manual (user taps done)</option>
                                    </select>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formData.trackingType === "manual"
                                            ? "User must manually mark each day as done"
                                            : `Progress tracked automatically from user's ${formData.trackingType} activity`}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration (days) *</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Difficulty *</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e]"
                                    >
                                        <option value="active">Active (eligible for scheduling)</option>
                                        <option value="inactive">Inactive (excluded from scheduling)</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setShowCreateModal(false); resetForm(); }}
                                        className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white rounded-full font-bold hover:shadow-lg transition-all"
                                    >
                                        {editingTemplate ? "Update Template" : "Create Template"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChallengesPage;