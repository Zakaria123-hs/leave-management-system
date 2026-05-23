import  { useState, useEffect } from "react";
import { pendingRequest, approveRequest, rejectRequest } from "../services/superviceService";

const SupervisorPendingTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch requests waiting for supervisor approval
    const fetchPendingRequests = async () => {
        try {
            // Replace with your actual supervisor pending API route
            const response = await pendingRequest();
            setRequests(response.data.pending_req);

        } catch (error) {
            console.error("Error fetching team requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    // Handle Action (Approve / Reject)
    const handleAction = async (id, statusAction) => {
        try {
            if (statusAction === "approve") {
                const response = await approveRequest(id)
                setMessage(`Successfully processed: ${response.message}`);
            }
            if (statusAction === "reject") {
                const response = await rejectRequest(id)
                setMessage(`Successfully processed: ${response.message}`);
            }
            
            // Refresh table data
            fetchPendingRequests(); 
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(`Failed to ${statusAction} request:`, error);
            alert("Action failed. Please try again.");
        }
    };

    if (loading) return <div className="text-center p-6 text-sm text-gray-500">Loading team requests...</div>;

    return (
        <div className="w-full">
            {message && (
                <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-100">
                    {message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/70">
                            <th className="py-3 px-4">Employee</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Duration</th>
                            <th className="py-3 px-4">Days</th>
                            <th className="py-3 px-4">Reason</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400">
                                    No pending requests requiring your validation.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition">
                                    <td className="py-3.5 px-4 font-bold text-gray-800">{req.employee_name}</td>
                                    <td className="py-3.5 px-4 text-gray-600">{req.leave_type_label}</td>
                                    <td className="py-3.5 px-4 text-gray-500">
                                        {req.start_date} to {req.end_date}
                                    </td>
                                    <td className="py-3.5 px-4 font-semibold text-gray-700">{req.days_count} d</td>
                                    <td className="py-3.5 px-4 text-gray-500 italic">"{req.reason || 'N/A'}"</td>
                                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                                        {/* Approve Button */}
                                        <button 
                                            onClick={() => handleAction(req.id, "approve")}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm text-[11px] cursor-pointer"
                                        >
                                            Approve
                                        </button>
                                        {/* Reject Button */}
                                        <button 
                                            onClick={() => handleAction(req.id, "reject")}
                                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm text-[11px] cursor-pointer"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupervisorPendingTable;