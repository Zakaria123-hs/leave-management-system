import LeaveRequestsTable from "../components/LeaveRequestsTable";
import { getMyBalances, getMyNotifications, getMyRequests } from "../services/employeeService"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LoadingSpinner from "../components/LoadingSpinner";

const EmployeeDashboard = () => {
    const {user} = useAuth()
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm,setShowForm] = useState(false)

    
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
            console.log(requestsRes.data.my_requests)
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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
                <div className="lg:col-span-2">
                    {/* 3. Call the table here and pass down the requests array as a prop */}
                    <LeaveRequestsTable requests={requests} />
                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboard;
