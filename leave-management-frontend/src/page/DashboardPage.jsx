import { useEffect, useState } from 'react';
import { dashboardData } from '../services/employeeService';
import DashboardLayout from "../layouts/DashboardLayout"; 
import { getMyNotifications } from '../services/employeeService';
import '../style/dashboardLayout.css'; 

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [notifications, setNotifications] = useState([]);
    const fetchNetification = async () => {
        const response = await getMyNotifications();
        setNotifications(response.data.notifications)
    }
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardData();
                setData(response.data);
            } catch (err) {
                console.error("Error loading dashboard metrics:", err);
                setError("Failed to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };
        fetchNetification();
        fetchDashboardData();
    }, []);
    const unreadCount = notifications ? notifications.filter(n => !n.read_at).length : 0;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-loading p-6 text-gray-500 text-center">
                    Chargement du tableau de bord...
                </div>
            </DashboardLayout>
        );
    }

    if (error || !data) {
        return (
            <DashboardLayout>
                <div className="dashboard-error p-6 text-red-500 text-center">
                    {error || "No data available"}
                </div>
            </DashboardLayout>
        );
    }

    const { general_info, time_off } = data;

    return (
            <DashboardLayout 
                unreadCount={unreadCount} 
                notifications={notifications} 
                fetachNotifications={fetchNetification}
            > 
            
            {/* The multi-column grid layout drops perfectly right into the main content workspace */}
            <div className="dashboard-grid">
                
                {/* LEFT COLUMN: Profile Info & Leave Balances Card */}
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar-circle">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/>
                            </svg>
                        </div>
                        <h2 className="employee-name">{general_info.name}</h2>
                        <p className="employee-role">{general_info.role?.toUpperCase()}</p>
                    </div>

                    <div className="general-info-section">
                        <h3 className="section-title">GENERAL INFORMATIONS</h3>
                        <div className="info-row">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{general_info.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Service:</span>
                            <span className="info-value">{general_info.service}</span>
                        </div>
                    </div>

                    <div className="time-off-section">
                        <div className="time-off-header">
                            <h3 className="section-title">Time Off</h3>
                            <span className="chart-icon">📈</span>
                        </div>
                        
                        <div className="stat-row">
                            <span className="stat-label">Days approved</span>
                            <span className="stat-value text-green">{time_off.days_approved}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Days awaiting approval</span>
                            <span className="stat-value text-orange">{time_off.days_awaiting_approval}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Days remaining</span>
                            <span className="stat-value text-blue">{time_off.days_remaining}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Interactive Activity Feed Stack */}
                <div className="dashboard-feed-stack">
                    
                    {/* TOP PANEL: Corporate Announcements Widget */}
                    <div className="feed-card announcements-card">
                        <div className="empty-state">
                            <div className="megaphone-icon">📢</div>
                            <p>No announcements exist at the moment.</p>
                        </div>
                    </div>

                    {/* BOTTOM PANEL: Assignments & Tasks Checklists */}
                    <div className="feed-card tasks-card">
                        <h3 className="panel-title font-bold text-gray-800 mb-2">Tasks</h3>
                        <div className="empty-state-bordered">
                            <div className="check-box-icon">📋</div>
                            <h4>All tasks are clear!</h4>
                            <p>No tasks assigned to you at the moment.</p>
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;