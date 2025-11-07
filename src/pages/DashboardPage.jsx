import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Decode JWT to get user info
    if (user?.token) {
      try {
        const payload = JSON.parse(atob(user.token.split('.')[1]))
        setUserRole(payload.role)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Dashboard
          </h1>
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> {user?.email || 'Not available'}
          </p>
          <p className="text-gray-600">
            <strong>Role:</strong> {userRole || 'Loading...'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Test Page */}
          <Link 
            to="/test/users" 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 shadow-md transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs bg-blue-700 px-2 py-1 rounded">USER</span>
            </div>
            <h3 className="text-xl font-bold mb-2">User Test Page</h3>
            <p className="text-blue-100 text-sm">
              Access user-specific features and content
            </p>
          </Link>

          {/* Admin Test Page */}
          <Link 
            to="/test/admin" 
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-6 shadow-md transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs bg-purple-700 px-2 py-1 rounded">ADMIN</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Admin Test Page</h3>
            <p className="text-purple-100 text-sm">
              Manage users and system settings
            </p>
          </Link>

          {/* Organizer Test Page */}
          <Link 
            to="/test/organizer" 
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 shadow-md transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs bg-green-700 px-2 py-1 rounded">ORGANIZER</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Organizer Test Page</h3>
            <p className="text-green-100 text-sm">
              Manage events and bookings
            </p>
          </Link>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔒 Role-Based Access Control Test
          </h3>
          <p className="text-yellow-700 text-sm">
            Try accessing different role pages. You'll only be able to access pages that match your assigned role. 
            If you try to access a restricted page, you'll see an "Access Denied" message.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage