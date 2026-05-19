import LeaveRequestsTable from "../components/LeaveRequestsTable";
import { getMyBalances, getMyNotifications, getMyRequests } from "../services/employeeService"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LoadingSpinner from "../components/LoadingSpinner";
import LeaveRequestBalance from "../components/LeaveRequestBalance";

const EmployeeDashboard = () => {
    const {user} = useAuth()
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm,setShowForm] = useState(false)
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
            console.log(balancesRes.data.myBalance)
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
        console.log(user)
        console.log(requests)

    }, []);


    if (loading) return <LoadingSpinner/>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col justify-between relative">
            
            {/* Main Application Layout Content Wrapper */}
            <div className="w-full lg:max-w-[calc(100%-280px)] ml-auto mt-auto">
                <LeaveRequestsTable 
                    requests={requests}
                    onBalanceClick={() => setShowBalance(true)} // Opens modal view
                />
            </div>

            {/* MODAL DISPLAY LAYER */}
            {showBalance && (
                <LeaveRequestBalance 
                    balance={balances} 
                    onClose={() => setShowBalance(false)} // Closes modal safely
                />
            )}
        </div>
    );
};

export default EmployeeDashboard;
