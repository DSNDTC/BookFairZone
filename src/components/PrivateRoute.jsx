import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-3 text-gray-700">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <div className="text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute