import React from 'react';

const LeaveRequestsTable = ({ requests }) => {
    // Helper function to render professional badges based on status
    const getStatusBadge = (status, approvedBy) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
                        Validated by {approvedBy || 'Manager'}
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full"></span>
                        Pending Approval
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-rose-500 rounded-full"></span>
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    // Format the timestamp nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900">My time requests</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                    Total: {requests?.length || 0}
                </span>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="px-6 py-3.5">Category</th>
                            <th className="px-6 py-3.5">Submission Date</th>
                            <th className="px-6 py-3.5">Reason</th>
                            <th className="px-6 py-3.5">State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {requests && requests.length > 0 ? (
                            requests.map((req, index) => (
                                <tr 
                                    key={index} 
                                    className="hover:bg-gray-50/70 transition-colors duration-150 ease-in-out"
                                >
                                    {/* Category */}
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {req.leave_type}
                                    </td>
                                    
                                    {/* Submission Date */}
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {formatDate(req.created_at)}
                                    </td>

                                    {/* Reason */}
                                    <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate">
                                        "{req.reason || 'No reason provided'}"
                                    </td>

                                    {/* State Badge */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(req.status, req.approved_by)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                                    No time requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveRequestsTable;