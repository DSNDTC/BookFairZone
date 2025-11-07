import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UserTestPage from './pages/UserTestPage'
import AdminTestPage from './pages/AdminTestPage'
import OrganizerTestPage from './pages/OrganizerTestPage'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import RoleRedirect from './components/RoleRedirect'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import OrganizerDashboard from './pages/OrganizerDashboard'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <RoleRedirect />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/user" 
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/organizer" 
          element={
            <PrivateRoute>
              <OrganizerDashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Role Test Routes - All Protected */}
        <Route 
          path="/test/user" 
          element={
            <PrivateRoute>
              <UserTestPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/test/admin" 
          element={
            <PrivateRoute>
              <AdminTestPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/test/organizer" 
          element={
            <PrivateRoute>
              <OrganizerTestPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  )
}

export default App
