import { lazy, Suspense } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Layout from './layout/Layout'

const Landing = lazy(() => import('../pages/Landing'))

/**
 * Root route ("/") gate.
 * - Logged out at "/": public marketing Landing page.
 * - Logged out on a deep link (e.g. "/create"): redirect to /login, same as before.
 * - Logged in: render the app shell (Layout), which renders the nested route
 *   (Dashboard at index, /create, /editor/:id, etc.) exactly as it already did.
 */
export default function HomeGate() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!user) {
    if (location.pathname === '/') {
      return (
        <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
          <Landing />
        </Suspense>
      )
    }
    return <Navigate to="/login" replace />
  }

  return <Layout />
}
