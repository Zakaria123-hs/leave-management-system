import { useEffect, useState } from "react";
import { getLeaveTypes, postLeaveRequest } from "../services/employeeService";
import LoadingSpinner from "./LoadingSpinner";

const LeaveRequestForm = ({onCloseForm, onSuccec}) => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 1. One state object to track all form fields
    const [formData, setFormData] = useState({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: ""
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Fetch dropdown list data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getLeaveTypes();
                setLeaveTypes(response.data);
            } catch (err) {
                console.error("Failed to load leave types", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Dynamic input handler to update form fields smoothly
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            // Send tracking data safely to Laravel backend
            const response = await postLeaveRequest(formData);
            
            setMessage(response.data.message || "Leave request submitted successfully!");
            
            // Clear form inputs after success
            setFormData({ leave_type_id: "", start_date: "", end_date: "", reason: "" });

            if(onSuccec) {
                await onSuccec()
            }

        } catch (err) {
            // Capture any validation errors thrown by your Laravel store() validations
            setError(err.response?.data?.error || err.response?.data?.message || "An error occurred");
        }
    };

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fadeIn">
            
            {/* The Modal Container Box */}
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-100 relative p-6 max-h-[90vh] overflow-y-auto">
                
                {/* 1. Close Button (X) precisely pinned in the top-right corner */}
                <button 
                    type="button"
                    onClick={onCloseForm}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close form"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Form Title Heading Layout */}
                <h2 className="text-xl font-bold mb-5 text-gray-800 pr-8">Submit a Leave Request</h2>
                
                {/* Server Status Feedback Banners */}
                {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">{message}</div>}
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Leave Type Dropdown */}
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">Leave Type</label>
                        <select 
                            name="leave_type_id"
                            value={formData.leave_type_id}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                            required
                        >
                            <option value="">Select leave type</option>
                            {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">Start Date</label>
                        <input 
                            type="date" 
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">End Date</label>
                        <input 
                            type="date" 
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">Reason</label>
                        <textarea 
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                            rows="3"
                            placeholder="Optional reason details..."
                        />
                    </div>

                    {/* Submit Action Button */}
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition dynamic-duration duration-200 mt-2"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeaveRequestForm;