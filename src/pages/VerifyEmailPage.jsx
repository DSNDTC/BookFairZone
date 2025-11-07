import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authApi } from '../api/authApi'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link')
        return
      }

      try {
        const response = await authApi.verifyEmail(token)
        setStatus('success')
        setMessage(response.data)
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Verification failed')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200 p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Verifying Email...</h2>
            <p className="text-gray-600 text-sm">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6 text-sm">{message}</p>
            <Link 
              to="/login" 
              className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white font-medium shadow-sm hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6 text-sm">{message}</p>
            <Link 
              to="/login" 
              className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white font-medium shadow-sm hover:bg-blue-700"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage