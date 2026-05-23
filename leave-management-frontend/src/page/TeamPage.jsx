import { useState, useEffect } from "react";
import { getTeam, getMyNotifications } from "../services/employeeService";
import "../style/teamPage.css";
import DashboardLayout from "../layouts/DashboardLayout";

const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

const RoleBadge = ({ role, isMySupervisor }) => {
    if (isMySupervisor) return <span className="badge badge-my-supervisor">YOUR SUPERVISOR</span>;
    if (role === "supervisor") return <span className="badge badge-supervisor">SUPERVISOR</span>;
    if (role === "hr") return <span className="badge badge-hr">HR</span>;
    return <span className="badge badge-employee">EMPLOYEE</span>;
};

const TeamPage = () => {
    const [team, setTeam] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotifications] = useState([])
    const fetchNetification = async () => {
            const response = await getMyNotifications();
            setNotifications(response.data.notifications)
        }
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await getTeam();
                setTeam(res.data);
                setFiltered(res.data);
                fetchNetification();
            } catch  {
                setError("Failed to load team.");
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            team.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.email.toLowerCase().includes(q) ||
                    (m.service && m.service.toLowerCase().includes(q))
            )
        );
    }, [search, team]);
    const unreadCount = notification ? notification.filter(n => !n.read_at).length : 0;


    if (loading) return (
        <DashboardLayout>
        <div className="team-center">
            <div className="team-spinner" />
        </div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>

            <div className="team-center">
                <p className="team-error">{error}</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout 
                unreadCount={unreadCount} 
                notifications={notification} 
                fetachNotifications={fetchNetification}
            > 
        <div className="team-page">
            <h1 className="team-title">My Team</h1>

            {/* Search */}
            <div className="team-search-wrapper">
                <svg className="team-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                    className="team-search-input"
                    placeholder="Search by name, email, service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <p className="team-count">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</p>

            {filtered.length === 0 ? (
                <div className="team-empty">No team members found.</div>
            ) : (
                <div className="team-table-wrapper">
                    <table className="team-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Job Title</th>
                                <th>Service</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="team-name-cell">
                                            <div className={`team-avatar ${member.is_my_supervisor ? "supervisor" : ""}`}>
                                                {getInitials(member.name)}
                                            </div>
                                            <div>
                                                <div className="team-member-name">{member.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <RoleBadge role={member.role} isMySupervisor={member.is_my_supervisor} />
                                    </td>
                                    <td>
                                        <span className="team-service">{member.service ?? "—"}</span>
                                    </td>
                                    <td>
                                        <span className="team-email">{member.email}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </DashboardLayout>
    );
};

export default TeamPage;