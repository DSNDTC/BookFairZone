import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleRedirect = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let role = null
    try {
      if (user?.token) {
        const payload = JSON.parse(atob(user.token.split('.')[1]))
        role = payload?.role
      }
    } catch (e) {
      // ignore
    }

    if (role === 'ADMIN_ROLE') {
      navigate('/dashboard/admin', { replace: true })
    } else if (role === 'ORGANIZER_ROLE') {
      navigate('/dashboard/organizer', { replace: true })
    } else {
      navigate('/dashboard/user', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="flex flex-col items-center gap-3 text-gray-700">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <div className="text-sm">Redirecting to your dashboard...</div>
      </div>
    </div>
  )
}

export default RoleRedirect
