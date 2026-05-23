import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom"; // Added useLocation for active styles

const DashboardLayout = ({ children, unreadCount, notifications }) => {
    const { user } = useAuth();
    const location = useLocation(); // Keeps track of what page the user is on
    
    const [openTimeMgmt, setOpenTimeMgmt] = useState(false);
    const [openRequests, setOpenRequests] = useState(false);
    const [openEmployee, setOpenEmployee] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notificationRef = useRef(null);

    // Helper function to check if a menu link is currently active
    const isActive = (path) => location.pathname === path;

    // Handle clicking outside notifications dropdown to close it safely
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Dynamically update the header title based on the active route location path
    const getHeaderTitle = () => {
        switch (location.pathname) {
            case "/dashboard": return "Dashboard Home";
            case "/request-supervisor": return "Subordinate Leave Validations";
            case "/holidays": return "Company Holidays Calendar";
            case "/mission-orders": return "Mission Orders";
            case "/expenses": return "Expense Tracking";
            default: return "HR Connect Workspace";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans antialiased">
            
            {/* ========================================================= */}
            {/* 1. FIXED LEFT SIDEBAR FRAMEWORK                           */}
            {/* ========================================================= */}
            <aside className="w-72 bg-[#0082c3] text-white flex flex-col fixed inset-y-0 left-0 z-40 shadow-xl select-none">
                
                {/* Application Branding Header Wrapper */}
                <div className="h-16 px-6 flex items-center gap-3 border-b border-white/10 bg-[#0071ab]">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xl tracking-wider text-white">
                        Ω
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-base tracking-wide uppercase leading-tight">HR Connect</span>
                        <span className="text-[10px] text-cyan-200 font-medium tracking-widest uppercase">Management</span>
                    </div>
                </div>

                {/* Main Sidebar Navigation Links Area */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1 scrollbar-thin">
                    
                    {/* Core Dashboard General Link - CONVERTED TO LINK */}
                    <Link 
                        to="/dashboard" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition font-medium text-sm ${
                            isActive("/dashboard") ? "bg-white/20 text-white font-semibold shadow-inner" : "text-sky-100 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                        <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                        </svg>
                        Dashboard
                    </Link>

                    {/* Conditional Supervisor Controls Section */}
                    {user?.role === "supervisor" && (
                        <div className="space-y-1">
                            <button 
                                onClick={() => setOpenEmployee(!openEmployee)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-sky-100 hover:text-white transition"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0-6h3m4 0h-4m-4 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Employees Management</span>
                                </div>
                                <svg className={`w-4 h-4 transform transition-transform duration-200 ${openEmployee ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {/* CONVERTED SUBMENU LINK */}
                            {(openEmployee || isActive("/supervisor/requests")) && (
                                <div className="pl-11 pr-2 space-y-1 border-l-2 border-white/10 ml-5">
                                    <Link 
                                        to="/supervisor/requests" 
                                        className={`block py-2 px-3 text-xs font-medium rounded-lg transition ${
                                            isActive("/supervisor/requests") ? "bg-white/10 text-white font-semibold" : "text-sky-100 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        Employee Requests
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* DROPDOWN 1: TIME MANAGEMENT */}
                    <div className="space-y-1">
                        <button 
                            onClick={() => setOpenTimeMgmt(!openTimeMgmt)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-sky-100 hover:text-white transition"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Time Management</span>
                            </div>
                            <svg className={`w-4 h-4 transform transition-transform duration-200 ${openTimeMgmt ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {/* CONVERTED SUBMENU LINK */}
                        {openTimeMgmt && (
                            <div className="pl-11 pr-2 space-y-1 border-l-2 border-white/10 ml-5">
                                <Link 
                                    to="/holidays" 
                                    className={`block py-2 px-3 text-xs font-medium rounded-lg transition ${
                                        isActive("/holidays") ? "bg-white/10 text-white font-semibold" : "text-sky-100 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    Company Holidays
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* DROPDOWN 2: REQUESTS SUB-MENU */}
                    <div className="space-y-1">
                        <button 
                            onClick={() => setOpenRequests(!openRequests)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm font-medium text-sky-100 hover:text-white transition"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Requests</span>
                            </div>
                            <svg className={`w-4 h-4 transform transition-transform duration-200 ${openRequests ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {/* CONVERTED SUBMENU LINKS */}
                        {(openRequests || isActive("/mission-orders") || isActive("/expenses")) && (
                            <div className="pl-11 pr-2 space-y-1 border-l-2 border-white/10 ml-5">
                                <Link 
                                    to="/my-requests" 
                                    className={`block py-2 px-3 text-xs font-medium rounded-lg transition ${
                                        isActive("/my-requests") ? "bg-white/10 text-white font-semibold" : "text-sky-100 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    Time requests
                                </Link>
                                <Link 
                                    to="/mission-orders" 
                                    className={`block py-2 px-3 text-xs font-medium rounded-lg transition ${
                                        isActive("/mission-orders") ? "bg-white/10 text-white font-semibold" : "text-sky-100 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    Mission orders
                                </Link>
                                <Link 
                                    to="/expenses" 
                                    className={`block py-2 px-3 text-xs font-medium rounded-lg transition ${
                                        isActive("/expenses") ? "bg-white/10 text-white font-semibold" : "text-sky-100 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    Expenses
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* ========================================================= */}
            {/* 2. MAIN CONTAINER + DYNAMIC TOP NAVBAR                    */}
            {/* ========================================================= */}
            <div className="flex-1 pl-72 flex flex-col min-h-screen">
                
                {/* Top Navbar Layer */}
                <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between shadow-sm sticky top-0 z-30">
                    <div>
                        {/* 💡 FIXED: Dynamically matches the header title to your active page link selection */}
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">{getHeaderTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-5">
                        {/* Notifications Dropdown Container */}
                        <div className="relative" ref={notificationRef}>
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-full transition ${showNotifications ? "text-[#0082c3] bg-sky-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
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

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-left z-50 animate-fadeIn">
                                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                                    </div>
                                    <div className="px-4 pt-2 border-b border-gray-50 bg-gray-50/50">
                                        <span className="inline-block pb-2 px-1 text-xs font-semibold text-[#0082c3] border-b-2 border-[#0082c3]">All</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                        {!notifications || notifications.length === 0 ? (
                                            <div className="p-6 text-center text-xs text-gray-400">No recent notifications.</div>
                                        ) : (
                                            notifications.map((item) => (
                                                <div key={item.id} className="p-3.5 hover:bg-gray-50 transition flex gap-3 relative items-start">
                                                    <div className="p-1.5 bg-sky-50 text-[#0082c3] rounded-lg mt-0.5 shrink-0">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-semibold text-gray-900 leading-snug">{item.message}</h4>
                                                        <span className="text-[10px] text-gray-400 block mt-1 font-medium">
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {!item.read_at && <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0"></span>}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-6 w-[1px] bg-gray-200"></div>

                        {/* User Identity Widget */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#0082c3] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold text-gray-800 leading-tight">{user?.name}</p>
                                <p className="text-[11px] text-gray-400 font-medium">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Inner Core Workspace Page Content Area */}
                <main className="p-6 flex-1 flex flex-col justify-end">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;