import { Routes, Route, Navigate } from "react-router-dom";
import RequestDashboard from "./page/RequestDashboard";
import SupervisorDashboard from "./page/SupervisorDashboard";
import Login from "./page/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute"; // Your authentication middleware guard
function App() {
    return (
        <Routes> {/* 💡 NO <BrowserRouter> wrap here! Only start with <Routes> */}
            {/* Public Auth Gateway */}
            <Route path="/login" element={<Login />} />

            {/* Protected Supervisor Workspaces */}
            <Route 
                path="/supervisor/requests" 
                element={
                    <ProtectedRoute role={['supervisor']}>
                        <SupervisorDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Standard Employee Workspaces */}
            <Route 
                path="/my-requests" 
                element={
                    <ProtectedRoute role={['employee', 'supervisor', 'hr']}>
                        <RequestDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;