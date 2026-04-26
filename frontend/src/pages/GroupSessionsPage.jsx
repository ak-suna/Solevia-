import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Calendar, Users, Trash2, Check } from "lucide-react";
import ModeratorSidebar from "../components/ModeratorSidebar";
import { getGroupById } from "../services/communityService";
import {
    createGroupSession,
    getGroupSessionsList,
    rsvpGroupSession,
    deleteGroupSession
} from "../services/communityService";
import { jwtDecode } from "jwt-decode";

const GroupSessionsPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const token = localStorage.getItem("token");
    const currentUserId = token ? jwtDecode(token).id : null;

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ topic: "", description: "", scheduledAt: "", calendlyLink: "" });
    const [toast, setToast] = useState(null);

    const { data: groupData } = useQuery({
        queryKey: ["community", "group", groupId],
        queryFn: () => getGroupById(groupId),
        enabled: !!groupId
    });

    const { data: sessionsData, refetch } = useQuery({
        queryKey: ["group", "sessions", groupId],
        queryFn: () => getGroupSessionsList(groupId),
        enabled: !!groupId,
        refetchInterval: 15000
    });

    const group = groupData?.group;
    const sessions = sessionsData?.sessions ?? [];

    const member = group?.members?.find(m =>
        m.userId === currentUserId || m.userId?._id === currentUserId
    );
    const isModerator = member && (member.role === "moderator" || member.role === "admin");

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createGroupSession(groupId, form);
            setForm({ topic: "", description: "", scheduledAt: "" });
            setShowForm(false);
            refetch();
            showToast("Session created and members notified!");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handleRsvp = async (sessionId) => {
        try {
            const res = await rsvpGroupSession(sessionId);
            refetch();
            showToast(res.hasRsvp ? "RSVP confirmed!" : "RSVP removed");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handleDelete = async (sessionId) => {
        if (!window.confirm("Delete this session?")) return;
        try {
            await deleteGroupSession(sessionId);
            refetch();
            showToast("Session deleted");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            <ModeratorSidebar />

            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-h-[775px] overflow-y-auto">

                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(`/groups/${groupId}/moderator/dashboard`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "Brasika" }}>
                        <Calendar className="w-7 h-7 text-[#f4873e]" /> Group Sessions
                        {group?.name && <span className="text-gray-400 font-normal text-lg">— {group.name}</span>}
                    </h2>
                    {isModerator && (
                        <button
                            onClick={() => setShowForm(v => !v)}
                            className="ml-auto flex items-center gap-2 px-5 py-2 bg-[#f4873e] hover:bg-[#ffa669] text-white rounded-full text-sm font-semibold transition"
                        >
                            <Plus className="w-4 h-4" /> New Session
                        </button>
                    )}
                </div>

                {/* Create form */}
                {showForm && isModerator && (
                    <form onSubmit={handleCreate} className="mb-8 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-3xl p-6 border-2 border-orange-200 dark:border-orange-800 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Schedule a New Session</h3>
                        <input
                            required
                            value={form.topic}
                            onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                            placeholder="Session topic *"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] text-sm"
                        />
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Optional description..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] text-sm resize-none"
                        />
                        <input
                            required
                            type="datetime-local"
                            value={form.scheduledAt}
                            onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] text-sm"
                        />
                        <input
                            type="url"
                            value={form.calendlyLink}
                            onChange={e => setForm(f => ({ ...f, calendlyLink: e.target.value }))}
                            placeholder="Calendly meeting link (optional)"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] text-sm"
                        />
                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold">Cancel</button>
                            <button type="submit" className="px-5 py-2 rounded-full bg-[#f4873e] hover:bg-[#ffa669] text-white text-sm font-semibold transition">Create Session</button>
                        </div>
                    </form>
                )}

                {/* Sessions list */}
                {sessions.length === 0 ? (
                    <div className="text-center py-16">
                        <Calendar className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">No sessions scheduled yet.</p>
                        {isModerator && <p className="text-sm text-gray-400 mt-1">Click "New Session" to schedule one.</p>}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map(session => (
                            <div key={session._id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">{session.topic}</h4>
                                        {session.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{session.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${session.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                                                session.status === "completed" ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300" :
                                                    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                            }`}>
                                            {session.status}
                                        </span>
                                        {(isModerator || session.createdBy?._id === currentUserId) && (
                                            <button onClick={() => handleDelete(session._id)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(session.scheduledAt).toLocaleDateString()} at {new Date(session.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {session.rsvpCount} RSVPed
                                    </span>
                                    {session.calendlyLink && (
                                        <a
                                            href={session.calendlyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition"
                                        >
                                            Join via Calendly
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleRsvp(session._id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${session.hasRsvp
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                                            : "bg-[#89beab] hover:bg-[#6fa893] text-white"
                                        }`}
                                >
                                    {session.hasRsvp ? <><Check className="w-4 h-4" /> RSVPed</> : "RSVP"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {toast && (
                <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full text-white font-semibold shadow-lg ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default GroupSessionsPage;