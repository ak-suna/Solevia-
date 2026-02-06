// import React, { useState, useEffect } from "react";
// import { getToken } from "../services/auth";

// const AdminReportsPage = () => {
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState("pending"); // pending, under-review, resolved, all
//     const [selectedReport, setSelectedReport] = useState(null);

//     useEffect(() => {
//         fetchReports();
//     }, [filter]);

//     const fetchReports = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 `http://localhost:5000/api/reports?status=${filter}`,
//                 {
//                     headers: { Authorization: `Bearer ${getToken()}` }
//                 }
//             );
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.error);
//             setReports(data.reports || []);
//         } catch (err) {
//             alert(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateReportStatus = async (reportId, status, action, notes) => {
//         try {
//             const response = await fetch(
//                 `http://localhost:5000/api/reports/${reportId}`,
//                 {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${getToken()}`
//                     },
//                     body: JSON.stringify({ status, action, adminNotes: notes })
//                 }
//             );

//             if (!response.ok) throw new Error("Failed to update report");

//             alert("Report updated successfully");
//             setSelectedReport(null);
//             fetchReports();
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     const getReasonEmoji = (reason) => {
//         const emojiMap = {
//             spam: "🚫",
//             harassment: "😠",
//             "inappropriate-content": "⚠️",
//             misinformation: "❌",
//             "hate-speech": "💔",
//             "self-harm": "🆘",
//             violence: "⚔️",
//             other: "📝"
//         };
//         return emojiMap[reason] || "📝";
//     };

//     const getStatusColor = (status) => {
//         const colorMap = {
//             pending: "#ffc107",
//             "under-review": "#17a2b8",
//             resolved: "#28a745",
//             dismissed: "#6c757d"
//         };
//         return colorMap[status] || "#6c757d";
//     };

//     if (loading) return <div style={styles.loading}>Loading reports...</div>;

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <h2>🚨 Reports Management</h2>
//                 <div style={styles.stats}>
//                     <span style={styles.stat}>
//                         Total: {reports.length}
//                     </span>
//                 </div>
//             </div>

//             {/* Filter Tabs */}
//             <div style={styles.filterTabs}>
//                 {["pending", "under-review", "resolved", "dismissed", "all"].map(status => (
//                     <button
//                         key={status}
//                         onClick={() => setFilter(status)}
//                         style={{
//                             ...styles.filterBtn,
//                             ...(filter === status ? styles.activeFilter : {})
//                         }}
//                     >
//                         {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
//                     </button>
//                 ))}
//             </div>

//             {/* Reports Table */}
//             <div style={styles.tableContainer}>
//                 <table style={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>Type</th>
//                             <th>Reason</th>
//                             <th>Reported By</th>
//                             <th>Status</th>
//                             <th>Date</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {reports.map(report => (
//                             <tr key={report._id}>
//                                 <td>
//                                     <span style={styles.badge}>
//                                         {report.reportType}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     {getReasonEmoji(report.reason)} {report.reason}
//                                 </td>
//                                 <td>
//                                     {report.reportedBy?.firstName} {report.reportedBy?.lastName}
//                                     <br />
//                                     <small style={{ color: "#666" }}>
//                                         {report.reportedBy?.email}
//                                     </small>
//                                 </td>
//                                 <td>
//                                     <span style={{
//                                         ...styles.statusBadge,
//                                         backgroundColor: getStatusColor(report.status)
//                                     }}>
//                                         {report.status}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     {new Date(report.createdAt).toLocaleDateString()}
//                                 </td>
//                                 <td>
//                                     <button
//                                         onClick={() => setSelectedReport(report)}
//                                         style={styles.reviewBtn}
//                                     >
//                                         Review
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Report Detail Modal */}
//             {selectedReport && (
//                 <div style={styles.modal} onClick={() => setSelectedReport(null)}>
//                     <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//                         <h3>Report Details</h3>

//                         <div style={styles.reportDetail}>
//                             <p><strong>Type:</strong> {selectedReport.reportType}</p>
//                             <p><strong>Reason:</strong> {selectedReport.reason}</p>
//                             <p><strong>Description:</strong> {selectedReport.description || "N/A"}</p>
//                             <p><strong>Reported By:</strong> {selectedReport.reportedBy?.email}</p>
//                             <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
//                         </div>

//                         {/* Target Content */}
//                         {selectedReport.targetDetails && (
//                             <div style={styles.targetContent}>
//                                 <h4>Reported Content:</h4>
//                                 {selectedReport.reportType === "post" && (
//                                     <div style={styles.postPreview}>
//                                         <p><strong>Author:</strong> {selectedReport.targetDetails.userId?.firstName}</p>
//                                         <p><strong>Content:</strong> {selectedReport.targetDetails.content}</p>
//                                     </div>
//                                 )}
//                                 {selectedReport.reportType === "user" && (
//                                     <div style={styles.postPreview}>
//                                         <p><strong>Name:</strong> {selectedReport.targetDetails.firstName} {selectedReport.targetDetails.lastName}</p>
//                                         <p><strong>Email:</strong> {selectedReport.targetDetails.email}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Action Buttons */}
//                         <div style={styles.actionButtons}>
//                             <button
//                                 onClick={() => updateReportStatus(
//                                     selectedReport._id,
//                                     "resolved",
//                                     "content-removed",
//                                     "Content removed due to policy violation"
//                                 )}
//                                 style={{ ...styles.actionBtn, backgroundColor: "#dc3545" }}
//                             >
//                                 Remove Content
//                             </button>
//                             <button
//                                 onClick={() => updateReportStatus(
//                                     selectedReport._id,
//                                     "resolved",
//                                     "warning",
//                                     "User warned"
//                                 )}
//                                 style={{ ...styles.actionBtn, backgroundColor: "#ffc107" }}
//                             >
//                                 Warn User
//                             </button>
//                             <button
//                                 onClick={() => updateReportStatus(
//                                     selectedReport._id,
//                                     "dismissed",
//                                     "none",
//                                     "No policy violation found"
//                                 )}
//                                 style={{ ...styles.actionBtn, backgroundColor: "#6c757d" }}
//                             >
//                                 Dismiss
//                             </button>
//                             <button
//                                 onClick={() => setSelectedReport(null)}
//                                 style={{ ...styles.actionBtn, backgroundColor: "#007bff" }}
//                             >
//                                 Close
//                             </button>
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
//         maxWidth: "1400px",
//         margin: "0 auto"
//     },
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "20px"
//     },
//     stats: {
//         display: "flex",
//         gap: "15px"
//     },
//     stat: {
//         padding: "10px 20px",
//         backgroundColor: "#f8f9fa",
//         borderRadius: "8px",
//         fontWeight: "500"
//     },
//     filterTabs: {
//         display: "flex",
//         gap: "10px",
//         marginBottom: "20px",
//         flexWrap: "wrap"
//     },
//     filterBtn: {
//         padding: "10px 20px",
//         border: "2px solid #ddd",
//         backgroundColor: "white",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontWeight: "500",
//         transition: "all 0.2s"
//     },
//     activeFilter: {
//         backgroundColor: "#007bff",
//         color: "white",
//         borderColor: "#007bff"
//     },
//     tableContainer: {
//         backgroundColor: "white",
//         borderRadius: "8px",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         overflow: "hidden"
//     },
//     table: {
//         width: "100%",
//         borderCollapse: "collapse"
//     },
//     badge: {
//         padding: "4px 12px",
//         backgroundColor: "#e9ecef",
//         borderRadius: "4px",
//         fontSize: "12px",
//         fontWeight: "500"
//     },
//     statusBadge: {
//         padding: "4px 12px",
//         color: "white",
//         borderRadius: "4px",
//         fontSize: "12px",
//         fontWeight: "500"
//     },
//     reviewBtn: {
//         padding: "6px 16px",
//         backgroundColor: "#007bff",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
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
//         maxHeight: "80vh",
//         overflow: "auto"
//     },
//     reportDetail: {
//         backgroundColor: "#f8f9fa",
//         padding: "15px",
//         borderRadius: "8px",
//         marginBottom: "20px"
//     },
//     targetContent: {
//         backgroundColor: "#fff3cd",
//         padding: "15px",
//         borderRadius: "8px",
//         marginBottom: "20px"
//     },
//     postPreview: {
//         backgroundColor: "white",
//         padding: "10px",
//         borderRadius: "4px",
//         marginTop: "10px"
//     },
//     actionButtons: {
//         display: "flex",
//         gap: "10px",
//         flexWrap: "wrap"
//     },
//     actionBtn: {
//         padding: "10px 20px",
//         border: "none",
//         borderRadius: "6px",
//         cursor: "pointer",
//         color: "white",
//         fontWeight: "500",
//         flex: "1",
//         minWidth: "120px"
//     },
//     loading: {
//         padding: "40px",
//         textAlign: "center",
//         fontSize: "18px"
//     }
// };

// export default AdminReportsPage;
import React, { useState, useEffect } from "react";
import { getToken } from "../services/auth";
import { AlertTriangle, Eye, X, CheckCircle, AlertCircle } from 'lucide-react';

const AdminReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending");
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, [filter]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/reports?status=${filter}`,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setReports(data.reports || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (reportId, status, action, notes) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/reports/${reportId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ status, action, adminNotes: notes })
                }
            );

            if (!response.ok) throw new Error("Failed to update report");

            alert("Report updated successfully");
            setSelectedReport(null);
            fetchReports();
        } catch (err) {
            alert(err.message);
        }
    };

    const getReasonEmoji = (reason) => {
        const emojiMap = {
            spam: "🚫",
            harassment: "😠",
            "inappropriate-content": "⚠️",
            misinformation: "❌",
            "hate-speech": "💔",
            "self-harm": "🆘",
            violence: "⚔️",
            other: "📝"
        };
        return emojiMap[reason] || "📝";
    };

    const getStatusColor = (status) => {
        const colorMap = {
            pending: "from-yellow-500 to-yellow-600",
            "under-review": "from-blue-500 to-blue-600",
            resolved: "from-green-500 to-green-600",
            dismissed: "from-gray-500 to-gray-600"
        };
        return colorMap[status] || "from-gray-500 to-gray-600";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                    Reports Management
                </h2>
                <div className="px-6 py-3 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full">
                    <span className="text-red-900 dark:text-red-300 font-bold">
                        Total Reports: {reports.length}
                    </span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-6 flex-wrap">
                {["pending", "under-review", "resolved", "dismissed", "all"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`
                            px-6 py-3 rounded-full font-bold transition-all
                            ${filter === status
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                            }
                        `}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                    </button>
                ))}
            </div>

            {/* Reports Table */}
            <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                            <tr>
                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Type</th>
                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Reason</th>
                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Reported By</th>
                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Status</th>
                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Date</th>
                                <th className="text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500 dark:text-gray-400">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No reports found</p>
                                    </td>
                                </tr>
                            ) : (
                                reports.map(report => (
                                    <tr key={report._id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-bold">
                                                {report.reportType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-900 dark:text-white">
                                            <span className="text-xl mr-2">{getReasonEmoji(report.reason)}</span>
                                            {report.reason}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-gray-900 dark:text-white font-medium">
                                                {report.reportedBy?.firstName} {report.reportedBy?.lastName}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {report.reportedBy?.email}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(report.status)} text-white rounded-full text-sm font-bold`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => setSelectedReport(report)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                Report Details
                            </h3>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Report Info */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl p-6 mb-6">
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Type:</span>
                                    <span className="text-gray-900 dark:text-white">{selectedReport.reportType}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Reason:</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {getReasonEmoji(selectedReport.reason)} {selectedReport.reason}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Description:</span>
                                    <span className="text-gray-900 dark:text-white">{selectedReport.description || "N/A"}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Reported By:</span>
                                    <span className="text-gray-900 dark:text-white">{selectedReport.reportedBy?.email}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Date:</span>
                                    <span className="text-gray-900 dark:text-white">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Target Content */}
                        {selectedReport.targetDetails && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-3xl p-6 mb-6 border-2 border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-3">Reported Content:</h4>
                                {selectedReport.reportType === "post" && (
                                    <div className="space-y-2">
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-bold">Author:</span> {selectedReport.targetDetails.userId?.firstName}
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-bold">Content:</span> {selectedReport.targetDetails.content}
                                        </p>
                                    </div>
                                )}
                                {selectedReport.reportType === "user" && (
                                    <div className="space-y-2">
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-bold">Name:</span> {selectedReport.targetDetails.firstName} {selectedReport.targetDetails.lastName}
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-bold">Email:</span> {selectedReport.targetDetails.email}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => updateReportStatus(
                                    selectedReport._id,
                                    "resolved",
                                    "content-removed",
                                    "Content removed due to policy violation"
                                )}
                                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                                Remove Content
                            </button>
                            <button
                                onClick={() => updateReportStatus(
                                    selectedReport._id,
                                    "resolved",
                                    "warning",
                                    "User warned"
                                )}
                                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
                            >
                                <AlertTriangle className="w-5 h-5" />
                                Warn User
                            </button>
                            <button
                                onClick={() => updateReportStatus(
                                    selectedReport._id,
                                    "dismissed",
                                    "none",
                                    "No policy violation found"
                                )}
                                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Dismiss
                            </button>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;