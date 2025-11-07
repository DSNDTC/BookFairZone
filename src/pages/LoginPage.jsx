import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
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

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
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
              <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm text-white/90">Login to continue managing your Book Fair Zone activities securely.</p>
              <div className="mt-8 aspect-[4/3] w-full rounded-xl bg-white/10"></div>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Sign in</h1>
              <p className="text-sm text-gray-600">Access your Book Fair Zone dashboard</p>
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
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
