import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Film, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Wand2, Mic, Video, Captions } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import FilmStrip from '../components/landing/FilmStrip'

const PIPELINE_STAGES = [
  { icon: Wand2, label: 'Prompt', time: '0:00' },
  { icon: Film, label: 'Script', time: '0:04' },
  { icon: Mic, label: 'Voice', time: '0:09' },
  { icon: Video, label: 'Video', time: '0:18' },
  { icon: Captions, label: 'Subtitles', time: '0:24' },
]

const FEATURES = [
  { icon: Wand2, text: 'Generate a full script from a single prompt' },
  { icon: Mic, text: 'Natural narration in 10+ languages via ElevenLabs' },
  { icon: Video, text: 'Text-to-video with Runway, Kling or Veo' },
  { icon: Captions, text: 'Auto-transcribed, perfectly-synced captions' },
]

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<'email' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldError(null)

    if (!email.trim() || !isValidEmail(email.trim())) {
      setFieldError('email')
      setError('Enter a valid email address.')
      return
    }
    if (!password) {
      setError('Enter your password.')
      return
    }

    setLoading(true)
    const { error: err } = await signIn(email.trim(), password)
    setLoading(false)
    if (err) {
      setError(err)
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left — marketing panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(6,182,212,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.16), transparent 50%)',
          }}
        />
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Creator Pro
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            From a prompt to a<br />finished video, in minutes.
          </h1>
          <p className="text-slate-400 mb-10">
            One pipeline — script, voice, video and captions — connected end to end.
          </p>

          <div className="mb-10">
            <FilmStrip stages={PIPELINE_STAGES} active={2} />
          </div>

          <div className="space-y-4">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm text-slate-300">{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Creator Pro
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm mb-6">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldError(null) }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={fieldError === 'email'}
                    className={`input-premium w-full pl-10 pr-4 py-3 ${fieldError === 'email' ? 'border-red-500/60 focus:ring-red-500/40' : ''}`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="input-premium w-full pl-10 pr-10 py-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="gradient-btn-primary w-full py-3 rounded-lg font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
