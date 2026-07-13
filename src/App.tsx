import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Sentence from './pages/Sentence'
import Review from './pages/Review'
import Account from './pages/Account'
import ResetPassword from './pages/ResetPassword'
import Anthology from './pages/Anthology'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Support from './pages/Support'

// Auth state is resolved once at app level — not per-route
interface AuthCtx { session: Session | null; loading: boolean }
const AuthContext = createContext<AuthCtx>({ session: null, loading: true })
export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') {
        window.location.href = '/reset-password'
        return
      }
      setSession(s)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--paper)' }}>
        <span className="sym" style={{ fontSize: 28, color: 'var(--faint)', opacity: 0.6 }}>❧</span>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/app/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/app/sentence/:id" element={<ProtectedRoute><Sentence /></ProtectedRoute>} />
          <Route path="/app/anthology" element={<ProtectedRoute><Anthology /></ProtectedRoute>} />
          <Route path="/app/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
          <Route path="/app/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
