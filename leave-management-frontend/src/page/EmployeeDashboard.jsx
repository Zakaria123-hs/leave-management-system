import LeaveRequestsTable from "../components/LeaveRequestsTable";
import { getMyBalances, getMyNotifications, getMyRequests } from "../services/employeeService";
import { useState, useEffect } from "react";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LoadingSpinner from "../components/LoadingSpinner";
import LeaveRequestBalance from "../components/LeaveRequestBalance";
import DashboardLayout from "../layouts/DashboardLayout";

const EmployeeDashboard = () => {
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showBalance, setShowBalance] = useState(false);

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
    }, []);

    if (loading) return <LoadingSpinner />;

    const unreadCount = notifications ? notifications.filter(n => !n.read_at).length : 0;

    return (
        <DashboardLayout 
            unreadCount={unreadCount} 
            notifications={notifications} 
            fetchNotificationData={fetchData}
        >
            {/* core Workspace Table Content (Injected directly down in bottom right) */}
            <div className="w-full overflow-hidden">
                <LeaveRequestsTable 
                    requests={requests}
                    onBalanceClick={() => setShowBalance(true)} 
                    onFormClick={() => setShowForm(true)}
                />
            </div>

            {/* MODAL LIGHTBOX LAYERS */}
            {showBalance && (
                <LeaveRequestBalance balance={balances} onClose={() => setShowBalance(false)} />
            )}
            
            {showForm && (
                <LeaveRequestForm onCloseForm={() => setShowForm(false)} onSuccec={fetchData} />
            )}
        </DashboardLayout>
    );
};

export default EmployeeDashboard;