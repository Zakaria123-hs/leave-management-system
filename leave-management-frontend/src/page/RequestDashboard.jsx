import LeaveRequestsTable from "../components/LeaveRequestsTable";
import { getMyBalances, getMyNotifications, getMyRequests } from "../services/employeeService";
import { useState, useEffect } from "react";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LeaveRequestBalance from "../components/LeaveRequestBalance";
import DashboardLayout from "../layouts/DashboardLayout";

const RequestDashboard = () => {
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
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
            console.log("from reqyestDashbord", requestsRes.data.my_requests)
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        console.log("zak")
    }, []);

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

export default RequestDashboard;