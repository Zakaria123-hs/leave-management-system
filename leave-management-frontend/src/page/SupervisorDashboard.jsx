import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SupervisorPendingTable from "../components/SupervisorPendingTable";
import { getMyNotifications } from "../services/employeeService";
import { useAuth } from "../context/AuthContext";
import HRDashboard from "./HrDashboard";

const SupervisorDashboard = () => {
    // 💡 FIX 1: Add execution parentheses () to call your hook function!
    const { user } = useAuth(); 
    
    const [notifications, setNotifications] = useState([]);
    
    const fetchNotification = async () => {
        try {
            const response = await getMyNotifications();
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };
    
    useEffect(() => {
        fetchNotification();
    }, []);
    
    const unreadCount = notifications ? notifications.filter(n => !n.read_at).length : 0;
    
    return (
        <DashboardLayout 
            unreadCount={unreadCount}
            notifications={notifications}
            fetchNotifications={fetchNotification} // Cleaned up the prop name typo too
        >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">Team Leave Requests</h2>
                    <p className="text-xs text-gray-400 mt-1">Review, approve, or reject pending leave applications from your subordinates.</p>
                </div>
                
                {/* 💡 FIX 2: Used optional chaining (user?.role) to prevent errors during boot load frames */}
                {user?.role === 'hr' ? (
                    <HRDashboard />
                ) : user?.role === 'supervisor' ? (
                    <SupervisorPendingTable />
                ) : (
                    <div className="p-4 text-xs text-gray-400 text-center">
                        Access restricted to specialized role management portals.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SupervisorDashboard;