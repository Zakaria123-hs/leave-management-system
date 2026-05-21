import  { useState, useMemo } from 'react';
import LeaveRequestBalance from './LeaveRequestBalance';

const LeaveRequestsTable = ({ requests = [], onBalanceClick,onFormClick }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showBalance] = useState(false)

    // 1. Extract unique categories dynamically from the requests data
    const categories = useMemo(() => {
        const allCats = requests.map(req => req.leave_type).filter(Boolean);
        return ['All', ...new Set(allCats)];
    }, [requests]);

    // 2. Filter the requests based on dropdown choice
    const filteredRequests = useMemo(() => {
        if (selectedCategory === 'All') return requests;
        return requests.filter(req => req.leave_type === selectedCategory);
    }, [selectedCategory, requests]);

    // Badge styling logic
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="w-full space-y-4">
            {/* ACTION BAR (FILTERS AND BUTTONS) */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between   w-full">
                {/* Left Side: Filter and Select Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex items-center gap-2 bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-100 transition cursor-pointer">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                        </svg>
                        Filter
                    </button>

                    {/* Category Selector input */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-w-[160px] cursor-pointer"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'All' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>

                    {/* Clear All Reset Button */}
                    {selectedCategory !== 'All' && (
                        <button 
                            onClick={() => setSelectedCategory('All')}
                            className="text-sm font-medium text-red-600 hover:text-red-800 px-2 py-1 transition cursor-pointer"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Right Side: Action Navigation Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                        onClick={onBalanceClick} // 2. Add this click triggers event handler
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition active:scale-95 cursor-pointer"
                    >
                        My balance
                    </button>
                    <button 
                        onClick={onFormClick}
                        className="bg-[#0071ab] text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition cursor-pointer"
                    >
                        Time request
                    </button>
                </div>
            </div>



            {/* LEAVE REQUESTS HISTORY TABLE */}
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-base font-semibold text-gray-900">My time requests</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                        Showing: {filteredRequests.length} of {requests.length}
                    </span>
                </div>

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
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req, index) => (
                                    <tr key={index} className="hover:bg-gray-50/70 transition-colors duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-900">{req.leave_type}</td>
                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatDate(req.created_at)}</td>
                                        <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate">"{req.reason || 'No reason provided'}"</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(req.status, req.approved_by)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                                        No matching time requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showBalance && <LeaveRequestBalance/>}
        </div>
    );
};

export default LeaveRequestsTable;