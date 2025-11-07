import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER_ROLE'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200 p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Registration Successful</h2>
          <p className="text-gray-600 mb-6">
            Please check your email to verify your account before logging in.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl bg-white/90 ring-1 ring-gray-200 shadow-sm">
          <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-10">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 20%, white 2px, transparent 2px)'}}/>
            <div className="relative w-full max-w-sm text-white">
              <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-white inline-block" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
              <p className="mt-2 text-sm text-white/90">Join Book Fair Zone to manage fairs, bookings and more.</p>
              <div className="mt-8 aspect-[4/3] w-full rounded-xl bg-white/10"></div>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Create account</h1>
              <p className="text-sm text-gray-600">Register to start using Book Fair Zone</p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Register as</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USER_ROLE">User</option>
                  <option value="ADMIN_ROLE">Admin</option>
                  <option value="ORGANIZER_ROLE">Organizer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage