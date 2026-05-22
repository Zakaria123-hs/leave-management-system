
import DashboardLayout from "../layouts/DashboardLayout";
import SupervisorPendingTable from "../components/SupervisorPendingTable";

const SupervisorDashboard = () => {
    return (
        <DashboardLayout>
            {/* The table drops neatly right into the changing workspace area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">Team Leave Requests</h2>
                    <p className="text-xs text-gray-400 mt-1">Review, approve, or reject pending leave applications from your subordinates.</p>
                </div>
                {/* Render the core validation list component */}
                <SupervisorPendingTable />
            </div>
        </DashboardLayout>
    );
};

export default SupervisorDashboard;