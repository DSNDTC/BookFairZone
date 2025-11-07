import { useEffect, useState } from 'react'
import api from '../api/api'

const AdminTestPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This endpoint should be protected with ADMIN role
        const response = await api.get('/admin/test')
        setData(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Access denied - Admin role required')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-600 mt-4">This page requires ADMIN role</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <svg className="h-8 w-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800">Admin Test Page</h1>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-purple-800 font-medium">✅ Access Granted - ADMIN Role</p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Admin Features:</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Manage all users and roles</li>
                <li>View system analytics</li>
                <li>Configure system settings</li>
                <li>Approve/reject bookings</li>
                <li>Manage halls and venues</li>
                <li>Access audit logs</li>
              </ul>
            </div>

            {data && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Backend Response:</h3>
                <pre className="text-sm text-gray-600 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTestPage