import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import HomeGate from './components/HomeGate'

const Login          = lazy(() => import('./pages/Login'))
const Register       = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword  = lazy(() => import('./pages/ResetPassword'))
const Terms          = lazy(() => import('./pages/Terms'))
const Privacy        = lazy(() => import('./pages/Privacy'))
const ApiDocs        = lazy(() => import('./pages/ApiDocs'))
const JVZooOffer     = lazy(() => import('./pages/JVZooOffer'))
const Dashboard      = lazy(() => import('./pages/Dashboard'))
const Create         = lazy(() => import('./pages/Create'))
const Editor         = lazy(() => import('./pages/Editor'))
const Projects       = lazy(() => import('./pages/Projects'))
const Team           = lazy(() => import('./pages/Team'))
const AIPipeline     = lazy(() => import('./pages/AIPipeline'))
const Autopilot      = lazy(() => import('./pages/Autopilot'))
const Billing        = lazy(() => import('./pages/Billing'))
const Settings       = lazy(() => import('./pages/Settings'))
const AffiliateReview = lazy(() => import('./pages/AffiliateReview'))
const RenderHistory  = lazy(() => import('./pages/RenderHistory'))
const Analytics      = lazy(() => import('./pages/Analytics'))
const Admin          = lazy(() => import('./pages/Admin'))
const Referrals      = lazy(() => import('./pages/Referrals'))
const Marketplace    = lazy(() => import('./pages/Marketplace'))

// Named exports via wrapper modules
const AIScript    = lazy(() => import('./pages/AITools').then(m => ({ default: m.AIScript })))
const AIVoice     = lazy(() => import('./pages/AITools').then(m => ({ default: m.AIVoice })))
const AIMusic     = lazy(() => import('./pages/AITools').then(m => ({ default: m.AIMusic })))
const AISubtitles = lazy(() => import('./pages/AITools').then(m => ({ default: m.AISubtitles })))
const AIThumbnail = lazy(() => import('./pages/AITools').then(m => ({ default: m.AIThumbnail })))
const AIShorts    = lazy(() => import('./pages/AITools').then(m => ({ default: m.AIShorts })))
const AISEO       = lazy(() => import('./pages/AITools').then(m => ({ default: m.AISEO })))

function PageSkeleton() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 animate-pulse" />
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/terms"           element={<Terms />} />
          <Route path="/privacy"         element={<Privacy />} />
          <Route path="/docs/api"        element={<ApiDocs />} />
          <Route path="/offer"           element={<JVZooOffer />} />

          <Route path="/" element={<HomeGate />}>
            <Route index                     element={<Dashboard />} />
            <Route path="create"             element={<Create />} />
            <Route path="editor/:projectId?" element={<Editor />} />
            <Route path="projects"           element={<Projects />} />
            <Route path="team"               element={<Team />} />
            <Route path="ai-pipeline"        element={<AIPipeline />} />
            <Route path="autopilot"          element={<Autopilot />} />
            <Route path="billing"            element={<Billing />} />
            <Route path="settings"           element={<Settings />} />
            <Route path="affiliate-review"   element={<AffiliateReview />} />
            <Route path="render-history"     element={<RenderHistory />} />
            <Route path="analytics"          element={<Analytics />} />
            <Route path="referrals"          element={<Referrals />} />
            <Route path="marketplace"        element={<Marketplace />} />
            <Route path="admin"              element={<Admin />} />
            <Route path="ai-script"          element={<AIScript />} />
            <Route path="ai-voice"           element={<AIVoice />} />
            <Route path="ai-music"           element={<AIMusic />} />
            <Route path="ai-subtitles"       element={<AISubtitles />} />
            <Route path="ai-thumbnail"       element={<AIThumbnail />} />
            <Route path="ai-shorts"          element={<AIShorts />} />
            <Route path="ai-seo"             element={<AISEO />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(15,23,42,0.92)',
            backdropFilter: 'blur(16px)',
            color: '#f1f5f9',
            border: '1px solid rgba(148,163,184,0.1)',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
        }}
      />
    </AuthProvider>
  )
}

export default App
