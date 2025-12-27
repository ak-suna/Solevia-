// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getProfile, updateProfile, changePassword } from "../services/profile";
// import { logout } from "../services/auth";
// import { ChevronRight, LogOut, Save, X, Check, Camera } from "lucide-react";

// const SettingsPage = () => {
//     const navigate = useNavigate();
//     const [activeSection, setActiveSection] = useState("account");
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [message, setMessage] = useState({ type: "", text: "" });
//     const [editingField, setEditingField] = useState(null);

//     const [profile, setProfile] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//     });

//     const [tempValue, setTempValue] = useState("");

//     const [passwordData, setPasswordData] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//     });

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const fetchProfile = async () => {
//         try {
//             const data = await getProfile();
//             setProfile(data);
//         } catch (error) {
//             setMessage({ type: "error", text: error.message });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const startEditing = (field) => {
//         setEditingField(field);
//         setTempValue(profile[field] || "");
//         setMessage({ type: "", text: "" });
//     };

//     const cancelEditing = () => {
//         setEditingField(null);
//         setTempValue("");
//     };

//     const saveField = async (field) => {
//         setSaving(true);
//         setMessage({ type: "", text: "" });

//         try {
//             await updateProfile({ [field]: tempValue });
//             setProfile({ ...profile, [field]: tempValue });
//             setEditingField(null);
//             setMessage({ type: "success", text: "Updated successfully!" });
//             setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//         } catch (error) {
//             setMessage({ type: "error", text: error.message });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handlePasswordSubmit = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         setMessage({ type: "", text: "" });

//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             setMessage({ type: "error", text: "Passwords do not match" });
//             setSaving(false);
//             return;
//         }

//         try {
//             await changePassword(passwordData.currentPassword, passwordData.newPassword);
//             setMessage({ type: "success", text: "Password changed successfully!" });
//             setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
//             setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//         } catch (error) {
//             setMessage({ type: "error", text: error.message });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
//             </div>
//         );
//     }

//     const InfoField = ({ label, value, field, editable = true }) => (
//         <div className="flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 px-4 transition-colors">
//             <span className="text-gray-600 font-medium">{label}</span>
//             {editingField === field ? (
//                 <div className="flex items-center gap-2">
//                     <input
//                         type="text"
//                         value={tempValue}
//                         onChange={(e) => setTempValue(e.target.value)}
//                         className="px-3 py-1 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
//                         autoFocus
//                     />
//                     <button
//                         onClick={() => saveField(field)}
//                         disabled={saving}
//                         className="p-1 text-green-600 hover:bg-green-50 rounded"
//                     >
//                         <Check className="w-5 h-5" />
//                     </button>
//                     <button
//                         onClick={cancelEditing}
//                         className="p-1 text-red-600 hover:bg-red-50 rounded"
//                     >
//                         <X className="w-5 h-5" />
//                     </button>
//                 </div>
//             ) : (
//                 <div className="flex items-center gap-2">
//                     <span className="text-gray-800 font-medium">{value || "Not set"}</span>
//                     {editable && (
//                         <button
//                             onClick={() => startEditing(field)}
//                             className="p-1 hover:bg-gray-200 rounded transition-colors"
//                         >
//                             <ChevronRight className="w-5 h-5 text-gray-400" />
//                         </button>
//                     )}
//                 </div>
//             )}
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6">
//             <div className="max-w-6xl mx-auto flex gap-6">
//                 {/* Left Sidebar */}
//                 <div className="w-72 bg-white rounded-3xl p-6 shadow-lg h-fit">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
//                     <div className="space-y-2">
//                         <button
//                             onClick={() => setActiveSection("account")}
//                             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
//                                 activeSection === "account"
//                                     ? "bg-pink-100 text-pink-600 border-l-4 border-pink-500"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }`}
//                         >
//                             Account
//                         </button>
//                         <button
//                             onClick={() => setActiveSection("notifications")}
//                             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
//                                 activeSection === "notifications"
//                                     ? "bg-pink-100 text-pink-600 border-l-4 border-pink-500"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }`}
//                         >
//                             Notifications
//                         </button>
//                         <button
//                             onClick={() => setActiveSection("security")}
//                             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
//                                 activeSection === "security"
//                                     ? "bg-pink-100 text-pink-600 border-l-4 border-pink-500"
//                                     : "text-gray-600 hover:bg-gray-50"
//                             }`}
//                         >
//                             Security
//                         </button>
//                         <button
//                             onClick={handleLogout}
//                             className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 mt-8"
//                         >
//                             <LogOut className="w-5 h-5" />
//                             Logout
//                         </button>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 bg-white rounded-3xl p-8 shadow-lg">
//                     {/* Message Display */}
//                     {message.text && (
//                         <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
//                             message.type === "success"
//                                 ? "bg-green-50 text-green-700 border border-green-200"
//                                 : "bg-red-50 text-red-700 border border-red-200"
//                         }`}>
//                             {message.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
//                             <span>{message.text}</span>
//                         </div>
//                     )}

//                     {/* Account Section */}
//                     {activeSection === "account" && (
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>

//                             {/* Profile Picture */}
//                             <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
//                                 <div className="relative">
//                                     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
//                                         {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
//                                     </div>
//                                     <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
//                                         <Camera className="w-4 h-4 text-pink-500" />
//                                     </button>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-500">Profile Picture</p>
//                                     <button className="text-sm text-pink-500 hover:text-pink-600 font-medium">
//                                         Upload new picture
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Basic Info */}
//                             <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Info</h3>
//                             <div className="space-y-1 mb-8">
//                                 <InfoField 
//                                     label="First Name" 
//                                     value={profile.firstName} 
//                                     field="firstName"
//                                 />
//                                 <InfoField 
//                                     label="Last Name" 
//                                     value={profile.lastName} 
//                                     field="lastName"
//                                 />
//                                 <InfoField 
//                                     label="Email" 
//                                     value={profile.email} 
//                                     field="email"
//                                     editable={false}
//                                 />
//                                 <InfoField 
//                                     label="Phone" 
//                                     value={profile.phone} 
//                                     field="phone"
//                                 />
//                                 <InfoField 
//                                     label="Address" 
//                                     value={profile.address} 
//                                     field="address"
//                                 />
//                             </div>


//                         </div>
//                     )}

//                     {/* Notifications Section */}
//                     {activeSection === "notifications" && (
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
//                             <div className="bg-pink-50 p-8 rounded-2xl text-center">
//                                 <p className="text-gray-600">Notification preferences coming soon...</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Security Section */}
//                     {activeSection === "security" && (
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Security</h2>
                            
//                             {/* Change Password Form */}
//                             <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>
//                             <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Current Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         value={passwordData.currentPassword}
//                                         onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
//                                         required
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         New Password (min 6 characters)
//                                     </label>
//                                     <input
//                                         type="password"
//                                         value={passwordData.newPassword}
//                                         onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
//                                         required
//                                         minLength={6}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Confirm New Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         value={passwordData.confirmPassword}
//                                         onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
//                                         required
//                                         minLength={6}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
//                                     />
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     disabled={saving}
//                                     className="px-6 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-all disabled:opacity-50"
//                                 >
//                                     {saving ? "Updating..." : "Change Password"}
//                                 </button>
//                             </form>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SettingsPage;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getProfile, updateProfile, changePassword } from "../services/profile";
// import { logout } from "../services/auth";
// import { ChevronRight, LogOut, Save, X, Check, Camera, Moon, Sun } from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext"; // ADD THIS

// const SettingsPage = () => {
//     const navigate = useNavigate();
//     const { theme, toggleTheme } = useTheme(); // ADD THIS
//     const [activeSection, setActiveSection] = useState("account");
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [message, setMessage] = useState({ type: "", text: "" });
//     const [editingField, setEditingField] = useState(null);

//     const [profile, setProfile] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//     });

//     const [tempValue, setTempValue] = useState("");

//     const [passwordData, setPasswordData] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//     });

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const fetchProfile = async () => {
//         try {
//             const data = await getProfile();
//             setProfile(data);
//         } catch (error) {
//             setMessage({ type: "error", text: error.message });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const startEditing = (field) => {
//         setEditingField(field);
//         setTempValue(profile[field] || "");
//         setMessage({ type: "", text: "" });
//     };

//     const cancelEditing = () => {
//         setEditingField(null);
//         setTempValue("");
//     };

//     const saveField = async (field) => {
//         setSaving(true);
//         setMessage({ type: "", text: "" });

//         try {
//             await updateProfile({ [field]: tempValue });
//             setProfile({ ...profile, [field]: tempValue });
//             setEditingField(null);
//             setMessage({ type: "success", text: "Updated successfully!" });
//             setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//         } catch (error) {
//             setMessage({ type: "error", text: error.message });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handlePasswordSubmit = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         setMessage({ type: "", text: "" });

//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             setMessage({ type: "error", text: "Passwords do not match" });
//             setSaving(false);
//             return;
//         }

//         try {
//             await changePassword(passwordData.currentPassword, passwordData.newPassword);
//             setMessage({ type: "success", text: "Password changed successfully!" });
//             setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
//             setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//         } catch (error) {
//             setMessage({ type: "error", text: error.message });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 dark:border-pink-500"></div>
//             </div>
//         );
//     }

//     const InfoField = ({ label, value, field, editable = true }) => (
//         <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 transition-colors">
//             <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
//             {editingField === field ? (
//                 <div className="flex items-center gap-2">
//                     <input
//                         type="text"
//                         value={tempValue}
//                         onChange={(e) => setTempValue(e.target.value)}
//                         className="px-3 py-1 border border-pink-300 dark:border-pink-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500"
//                         autoFocus
//                     />
//                     <button
//                         onClick={() => saveField(field)}
//                         disabled={saving}
//                         className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
//                     >
//                         <Check className="w-5 h-5" />
//                     </button>
//                     <button
//                         onClick={cancelEditing}
//                         className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
//                     >
//                         <X className="w-5 h-5" />
//                     </button>
//                 </div>
//             ) : (
//                 <div className="flex items-center gap-2">
//                     <span className="text-gray-800 dark:text-gray-200 font-medium">{value || "Not set"}</span>
//                     {editable && (
//                         <button
//                             onClick={() => startEditing(field)}
//                             className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
//                         >
//                             <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
//                         </button>
//                     )}
//                 </div>
//             )}
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
//             <div className="max-w-6xl mx-auto flex gap-6">
//                 {/* Left Sidebar */}
//                 <div className="w-72 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg h-fit">
//                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>
//                     <div className="space-y-2">
//                         <button
//                             onClick={() => setActiveSection("account")}
//                             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
//                                 activeSection === "account"
//                                     ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
//                                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                             }`}
//                         >
//                             Account
//                         </button>
//                         <button
//                             onClick={() => setActiveSection("appearance")}
//                             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
//                                 activeSection === "appearance"
//                                     ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
//                                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                             }`}
//                         >
//                             Appearance
//                         </button>
//                         <button
//                             onClick={() => setActiveSection("notifications")}
//                             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
//                                 activeSection === "notifications"
//                                     ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
//                                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                             }`}
//                         >
//                             Notifications
//                         </button>
//                         <button
//                             onClick={() => setActiveSection("security")}
//                             className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
//                                 activeSection === "security"
//                                     ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
//                                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                             }`}
//                         >
//                             Security
//                         </button>
//                         <button
//                             onClick={handleLogout}
//                             className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all flex items-center gap-2 mt-8"
//                         >
//                             <LogOut className="w-5 h-5" />
//                             Logout
//                         </button>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
//                     {/* Message Display */}
//                     {message.text && (
//                         <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
//                             message.type === "success"
//                                 ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
//                                 : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
//                         }`}>
//                             {message.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
//                             <span>{message.text}</span>
//                         </div>
//                     )}

//                     {/* Account Section */}
//                     {activeSection === "account" && (
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Account Settings</h2>

//                             {/* Profile Picture */}
//                             <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
//                                 <div className="relative">
//                                     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
//                                         {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
//                                     </div>
//                                     <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg border-2 border-pink-200 dark:border-pink-600 hover:border-pink-400 dark:hover:border-pink-500 transition-colors">
//                                         <Camera className="w-4 h-4 text-pink-500 dark:text-pink-400" />
//                                     </button>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-500 dark:text-gray-400">Profile Picture</p>
//                                     <button className="text-sm text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-medium">
//                                         Upload new picture
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Basic Info */}
//                             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Basic Info</h3>
//                             <div className="space-y-1 mb-8">
//                                 <InfoField 
//                                     label="First Name" 
//                                     value={profile.firstName} 
//                                     field="firstName"
//                                 />
//                                 <InfoField 
//                                     label="Last Name" 
//                                     value={profile.lastName} 
//                                     field="lastName"
//                                 />
//                                 <InfoField 
//                                     label="Email" 
//                                     value={profile.email} 
//                                     field="email"
//                                     editable={false}
//                                 />
//                                 <InfoField 
//                                     label="Phone" 
//                                     value={profile.phone} 
//                                     field="phone"
//                                 />
//                                 <InfoField 
//                                     label="Address" 
//                                     value={profile.address} 
//                                     field="address"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Appearance Section - NEW */}
//                     {activeSection === "appearance" && (
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Appearance</h2>
                            
//                             <div className="space-y-6">
//                                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
//                                     <div>
//                                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Dark Mode</h3>
//                                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                                             Currently: {theme === 'dark' ? 'Dark' : 'Light'}
//                                         </p>
//                                     </div>
                                    
//                                     {/* Toggle Button */}
//                                     <button
//                                         onClick={toggleTheme}
//                                         className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 dark:bg-pink-600 transition-colors"
//                                     >
//                                         <span
//                                             className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform flex items-center justify-center ${
//                                                 theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
//                                             }`}
//                                         >
//                                             {theme === 'dark' ? (
//                                                 <Moon className="w-4 h-4 text-pink-600" />
//                                             ) : (
//                                                 <Sun className="w-4 h-4 text-gray-600" />
//                                             )}
//                                         </span>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Notifications Section */}
//                     {activeSection === "notifications" && (
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Notifications</h2>
//                             <div className="bg-pink-50 dark:bg-pink-900/20 p-8 rounded-2xl text-center border border-pink-100 dark:border-pink-800">
//                                 <p className="text-gray-600 dark:text-gray-400">Notification preferences coming soon...</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Security Section */}
//                     {activeSection === "security" && (
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Security</h2>
                            
//                             {/* Change Password Form */}
//                             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Change Password</h3>
//                             <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                         Current Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         value={passwordData.currentPassword}
//                                         onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
//                                         required
//                                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                         New Password (min 6 characters)
//                                     </label>
//                                     <input
//                                         type="password"
//                                         value={passwordData.newPassword}
//                                         onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
//                                         required
//                                         minLength={6}
//                                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                         Confirm New Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         value={passwordData.confirmPassword}
//                                         onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
//                                         required
//                                         minLength={6}
//                                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500"
//                                     />
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     disabled={saving}
//                                     className="px-6 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-600 dark:hover:bg-pink-700 transition-all disabled:opacity-50"
//                                 >
//                                     {saving ? "Updating..." : "Change Password"}
//                                 </button>
//                             </form>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SettingsPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword } from "../services/profile";
import { logout } from "../services/auth";
import { ChevronRight, LogOut, X, Check, Camera, Moon, Sun, ChevronLeft  } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext"; // IMPORT AT TOP
import { Link } from "react-router-dom";

const SettingsPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme(); // USE HOOK NORMALLY
    
    const [activeSection, setActiveSection] = useState("account");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [editingField, setEditingField] = useState(null);

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const [tempValue, setTempValue] = useState("");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            console.log("✅ Profile data received:", data); // Debug log
            setProfile(data);
        } catch (error) {
            console.error("❌ Profile fetch error:", error); // Debug log
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (field) => {
        setEditingField(field);
        setTempValue(profile[field] || "");
        setMessage({ type: "", text: "" });
    };

    const cancelEditing = () => {
        setEditingField(null);
        setTempValue("");
    };

    const saveField = async (field) => {
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            await updateProfile({ [field]: tempValue });
            setProfile({ ...profile, [field]: tempValue });
            setEditingField(null);
            setMessage({ type: "success", text: "Updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            setSaving(false);
            return;
        }

        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 dark:border-pink-500"></div>
            </div>
        );
    }

    const InfoField = ({ label, value, field, editable = true }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 transition-colors">
            <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
            {editingField === field ? (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="px-3 py-1 border border-pink-300 dark:border-pink-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                        autoFocus
                    />
                    <button
                        onClick={() => saveField(field)}
                        disabled={saving}
                        className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                    >
                        <Check className="w-5 h-5" />
                    </button>
                    <button
                        onClick={cancelEditing}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{value || "Not set"}</span>
                    {editable && (
                        <button
                            onClick={() => startEditing(field)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            {/* Back Button */}
        <Link
            to="/dashboard"
            className="flex items-center mb-6 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition font-medium"
        >
            <ChevronLeft className="mr-2 w-5 h-5" />
            Back to Dashboard
        </Link>
            <div className="max-w-6xl mx-auto flex gap-6">
                {/* Left Sidebar */}
                <div className="w-72 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg h-fit">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveSection("account")}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                                activeSection === "account"
                                    ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            Account
                        </button>
                        <button
                            onClick={() => setActiveSection("appearance")}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                                activeSection === "appearance"
                                    ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            Appearance
                        </button>
                        <button
                            onClick={() => setActiveSection("notifications")}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                                activeSection === "notifications"
                                    ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveSection("security")}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                                activeSection === "security"
                                    ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-l-4 border-pink-500"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            Security
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all flex items-center gap-2 mt-8"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
                    {/* Message Display */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                            message.type === "success"
                                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}>
                            {message.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Account Section */}
                    {activeSection === "account" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Account Settings</h2>

                            {/* Profile Picture */}
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
                                        {profile.firstName?.charAt(0) || "U"}{profile.lastName?.charAt(0) || ""}
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg border-2 border-pink-200 dark:border-pink-600 hover:border-pink-400 transition-colors">
                                        <Camera className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Profile Picture</p>
                                    <button className="text-sm text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-medium">
                                        Upload new picture
                                    </button>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Basic Info</h3>
                            <div className="space-y-1 mb-8">
                                <InfoField 
                                    label="First Name" 
                                    value={profile.firstName} 
                                    field="firstName"
                                />
                                <InfoField 
                                    label="Last Name" 
                                    value={profile.lastName} 
                                    field="lastName"
                                />
                                <InfoField 
                                    label="Email" 
                                    value={profile.email} 
                                    field="email"
                                    editable={false}
                                />
                                <InfoField 
                                    label="Phone" 
                                    value={profile.phone} 
                                    field="phone"
                                />
                                <InfoField 
                                    label="Address" 
                                    value={profile.address} 
                                    field="address"
                                />
                            </div>
                        </div>
                    )}

                    {/* Appearance Section */}
                    {activeSection === "appearance" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Appearance</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Dark Mode</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Currently: {theme === 'dark' ? 'Dark' : 'Light'}
                                        </p>
                                    </div>
                                    
                                    {/* Toggle Button */}
                                    <button
                                        onClick={toggleTheme}
                                        className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 dark:bg-pink-600 transition-colors"
                                    >
                                        <span
                                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform flex items-center justify-center ${
                                                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                        >
                                            {theme === 'dark' ? (
                                                <Moon className="w-4 h-4 text-pink-600" />
                                            ) : (
                                                <Sun className="w-4 h-4 text-gray-600" />
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Section */}
                    {activeSection === "notifications" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Notifications</h2>
                            <div className="bg-pink-50 dark:bg-pink-900/20 p-8 rounded-2xl text-center border border-pink-100 dark:border-pink-800">
                                <p className="text-gray-600 dark:text-gray-400">Notification preferences coming soon...</p>
                            </div>
                        </div>
                    )}

                    {/* Security Section */}
                    {activeSection === "security" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Security</h2>
                            
                            {/* Change Password Form */}
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Change Password</h3>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password (min 6 characters)
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-600 dark:hover:bg-pink-700 transition-all disabled:opacity-50"
                                >
                                    {saving ? "Updating..." : "Change Password"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;