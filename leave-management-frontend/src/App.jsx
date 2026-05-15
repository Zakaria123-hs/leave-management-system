import './App.css'
import LoginPage from './page/loginPage'
import { Routes,Route } from 'react-router-dom'
import EmployeeDashboard from './page/EmployeeDashboard'
import ManagerDashboard from './page/ManagerDashboard'
import HRDashboard from './page/HRDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
function App() {
  return (
    <>
      <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/employee" element={
              <ProtectedRoute role="employee">
                  <EmployeeDashboard />
              </ProtectedRoute>
          } />

          <Route path="/manager" element={
              <ProtectedRoute role="manager">
                  <ManagerDashboard />
              </ProtectedRoute>
          } />

          <Route path="/hr" element={
              <ProtectedRoute role="hr">
                  <HRDashboard />
              </ProtectedRoute>
          } />
      </Routes>
    </>
  )
}

export default App

