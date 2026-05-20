import LeaveRequestsTable from "../components/LeaveRequestsTable";
import { getMyBalances, getMyNotifications, getMyRequests } from "../services/employeeService";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LoadingSpinner from "../components/LoadingSpinner";
import LeaveRequestBalance from "../components/LeaveRequestBalance";

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    
    // New state to open/close the notification dropdown list card
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const fetchData = async () => {
        try {
            const [balancesRes, requestsRes, notificationsRes] = await Promise.all([
                getMyBalances(),
                getMyRequests(),
                getMyNotifications(),
            ]);
            setBalances(balancesRes.data.myBalance);
            setRequests(requestsRes.data.my_requests);
            setNotifications(notificationsRes.data.notifications);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Close notification panel if user clicks outside of it
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) return <LoadingSpinner />;

    // Calculate unread notifications dynamically from array length
    const unreadCount = notifications ? notifications.filter(n => !n.read_at).length : 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            
            {/* 1. TOP NAVBAR HEADER */}
            <header className="w-full bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between shadow-sm lg:max-w-[calc(100%-280px)] ml-auto relative z-30">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Time requests</h1>
                </div>

                <div className="flex items-center gap-5">
                    
                    {/* Notification Anchor Wrapper */}
                    <div className="relative" ref={notificationRef}>
                        {/* Notification Bell Icon */}
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2 rounded-full transition ${showNotifications ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* DROPDOWN PANEL (Matches screenshot UI rules perfectly) */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-[450px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-left z-50 animate-fadeIn">
                                {/* Header Title Row */}
                                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                                    <button 
                                        onClick={() => setShowNotifications(false)}
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Custom Filter View: Only "All" Tab Allowed */}
                                <div className="px-4 pt-2 border-b border-gray-50 bg-gray-50/50">
                                    <span className="inline-block pb-2 px-1 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 cursor-pointer">
                                        All
                                    </span>
                                </div>

                                {/* Scrollable Feed Row Loop container */}
                                <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center text-sm text-gray-400">No recent notifications found.</div>
                                    ) : (
                                        notifications.map((item) => (
                                            <div key={item.id} className="p-4 hover:bg-gray-50/70 transition flex gap-3.5 relative items-start">
                                                
                                                {/* Left Decorative Document Blueprint Vector Badge */}
                                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg mt-0.5 shrink-0">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>

                                                {/* Textual Body content details context */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                                                        {item.message || "A new update in Time request"}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 mt-0.5">Click to view the details.</p>
                                                    <span className="text-[11px] text-gray-400 block mt-2 font-medium">
                                                        {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
                                                    </span>
                                                </div>

                                                {/* Right Cyan Status Indicator Dot for Unread items */}
                                                {!item.read_at && (
                                                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0"></span>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Minimal Clean Vertical Divider Split Line */}
                    <div className="h-6 w-[1px] bg-gray-200"></div>

                    {/* User Context Metadata Element via AuthContext */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || "Employee Profile"}</p>
                            <p className="text-xs text-gray-400 font-medium">{user?.email || "loading status..."}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. MAIN CONTAINER BODY */}
            <main className="w-full lg:max-w-[calc(100%-280px)] ml-auto p-6 min-h-[calc(100vh-65px)] flex flex-col justify-end">
                <div className="w-full overflow-hidden">
                    <LeaveRequestsTable 
                        requests={requests}
                        onBalanceClick={() => setShowBalance(true)} 
                        onFormClick={() => setShowForm(true)}
                    />
                </div>
            </main>

            {showBalance && (
                <LeaveRequestBalance 
                    balance={balances} 
                    onClose={() => setShowBalance(false)} 
                />
            )}
            
            {showForm && (
                <LeaveRequestForm
                    onCloseForm={() => setShowForm(false)}
                    onSuccec={fetchData} 
                />
            )}
        </div>
    );
};

export default EmployeeDashboard;