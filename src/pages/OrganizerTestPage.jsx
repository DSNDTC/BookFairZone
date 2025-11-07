import { useEffect, useState } from 'react'
import api from '../api/api'

const OrganizerTestPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This endpoint should be protected with ORGANIZER role
        const response = await api.get('/organizer/test')
        setData(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Access denied - Organizer role required')
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
          <p className="text-sm text-gray-600 mt-4">This page requires ORGANIZER role</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <svg className="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800">Organizer Test Page</h1>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">✅ Access Granted - ORGANIZER Role</p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Organizer Features:</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Create and manage book fair events</li>
                <li>View and manage hall bookings</li>
                <li>Coordinate with vendors</li>
                <li>Generate event reports</li>
                <li>Manage event schedules</li>
                <li>Handle participant registrations</li>
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

export default OrganizerTestPage