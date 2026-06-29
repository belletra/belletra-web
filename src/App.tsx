import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Sentence from './pages/Sentence'
import Review from './pages/Review'
import Account from './pages/Account'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Check initial session (covers page load and OAuth hash exchange)
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session)
      setLoading(false)
    })
    // Keep in sync with sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--paper)' }}>
        <span className="sym" style={{ fontSize: 28, color: 'var(--faint)', opacity: 0.6 }}>❧</span>
      </div>
    )
  }

  if (!authed) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/app/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/app/sentence/:id" element={<ProtectedRoute><Sentence /></ProtectedRoute>} />
        <Route path="/app/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/app/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  )
}
