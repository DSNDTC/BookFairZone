import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Content */}
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Book fairs • Learning • Halls
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Manage Book Fairs and Halls with Ease
              </h1>
              <p className="mt-4 text-base md:text-lg text-gray-700">
                Plan events, book halls, and handle registrations in one simple, secure place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white px-6 py-2.5 text-blue-700 font-medium hover:bg-blue-50"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="text-blue-600 mb-2">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Books</h3>
                  <p className="text-sm text-gray-700">Organize catalogs and exhibitors.</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="text-blue-600 mb-2">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Halls</h3>
                  <p className="text-sm text-gray-700">Check availability and book.</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="text-blue-600 mb-2">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Secure</h3>
                  <p className="text-sm text-gray-700">Safe access and payments.</p>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative min-h-[280px] md:min-h-full bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 25% 30%, white 2px, transparent 2px), radial-gradient(circle at 70% 60%, white 2px, transparent 2px)'}} />
              <div className="relative h-full flex items-center justify-center p-8">
                <div className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/10 ring-1 ring-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage