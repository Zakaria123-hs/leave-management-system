import { useState, useEffect } from "react";
import { hrPendingRequests, hrValidate } from "../services/hrService";

const HRDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await hrPendingRequests();
            setRequests(res.data.hr_pending);
            console.log(res.data.hr_pending)
        } catch {
            setError("Failed to load pending requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        setActionLoading(id + action);
        try {
            await hrValidate(id, action);
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch{
            alert("Action failed. Please try again.");
        } finally {
            setActionLoading(null);
        }
    };

    // ─── Loading State inside Table Boundary ─────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-gray-100 border-t-[#0082c3] rounded-full animate-spin" />
            </div>
        );
    }

    // ─── Error State inside Table Boundary ───────────────────────
    if (error) {
        return (
            <div className="flex items-center justify-center h-48">
                <p className="text-red-500 text-xs font-semibold">{error}</p>
            </div>
        );
    }

    // ─── Empty State ─────────────────────────────────────────────
    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p className="text-xs font-bold text-gray-500">No pending requests</p>
                <p className="text-[11px] text-gray-400 mt-0.5">All applications have been successfully evaluated.</p>
            </div>
        );
    }

    // ─── Table Element Core Data ─────────────────────────────────
    return (
        <div className="overflow-x-auto w-full -mx-6">
            <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-3.5 px-6">Employee</th>
                        <th className="py-3.5 px-6">Approved By</th>
                        <th className="py-3.5 px-6">Category</th>
                        <th className="py-3.5 px-6">Duration</th>
                        <th className="py-3.5 px-6">Days</th>
                        <th className="py-3.5 px-6">Reason</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                    {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50/40 transition-colors group">
                            {/* Employee Identity */}
                            <td className="py-4 px-6">
                                <span className="font-semibold text-gray-800 tracking-tight group-hover:text-[#0082c3] transition-colors">
                                    {req.employee_name}
                                </span>
                            </td>

                            {/* Manager/Supervisor Initials Avatar Badge */}
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-50 border border-sky-100 text-[#0082c3] text-[10px] font-bold shrink-0">
                                        {req.supervisor_who_approved
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </span>
                                    <span className="text-xs font-medium text-gray-600">
                                        {req.supervisor_who_approved}
                                    </span>
                                </div>
                            </td>

                            {/* Category Type */}
                            <td className="py-4 px-6">
                                <span className="text-xs font-semibold text-gray-500 bg-gray-100/80 px-2 py-1 rounded border border-gray-200/50">
                                    {req.leave_type}
                                </span>
                            </td>

                            {/* Timeline Span */}
                            <td className="py-4 px-6 font-medium text-gray-500 text-xs">
                                {req.start_date} &rarr; {req.end_date}
                            </td>

                            {/* Days Total count */}
                            <td className="py-4 px-6">
                                <span className="font-bold text-gray-800">
                                    {parseFloat(req.days_count).toFixed(1)} d
                                </span>
                            </td>

                            {/* Context justification Text */}
                            <td className="py-4 px-6 max-w-xs truncate">
                                <span className="text-xs text-gray-400 font-medium italic">
                                    "{req.reason}"
                                </span>
                            </td>

                            {/* Inline Control Buttons */}
                            <td className="py-4 px-6">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleAction(req.id, "approved")}
                                        disabled={actionLoading !== null}
                                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40"
                                    >
                                        {actionLoading === req.id + "approved" ? "..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={() => handleAction(req.id, "rejected")}
                                        disabled={actionLoading !== null}
                                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40"
                                    >
                                        {actionLoading === req.id + "rejected" ? "..." : "Reject"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HRDashboard;