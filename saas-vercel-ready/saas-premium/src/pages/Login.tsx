import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { Film, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Wand2, Mic, Video, Captions, ArrowUp } from 'lucide-react'
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

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.07, duration: 0.4, ease: EASE_OUT },
  }),
}

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<'email' | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const checkCapsLock = (e: KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'))
    }
  }

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
    <div className="min-h-screen flex bg-slate-950 relative overflow-hidden">
      {/* Ambient floating particles — full-page, subtle */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400/30 pointer-events-none"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.15, 0.6, 0.15],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (i % 7) * 0.4,
          }}
        />
      ))}

      {/* Left — marketing panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(6,182,212,0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.2), transparent 50%)',
          }}
        />
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="relative z-10 max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3 mb-10"
          >
            <motion.div
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
              animate={{ boxShadow: ['0 0 20px rgba(6,182,212,0.3)', '0 0 32px rgba(6,182,212,0.5)', '0 0 20px rgba(6,182,212,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Film className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Creator Pro
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-white leading-tight mb-4"
          >
            From a prompt to a<br />finished video, in minutes.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-slate-400 mb-10"
          >
            One pipeline — script, voice, video and captions — connected end to end.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-10"
          >
            <FilmStrip stages={PIPELINE_STAGES} active={2} />
          </motion.div>

          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                  <f.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm text-slate-300">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="flex lg:hidden items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Creator Pro
            </span>
          </motion.div>

          {/* Condensed feature strip — mobile only, since the full marketing panel is hidden below lg */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex lg:hidden items-center justify-center gap-4 mb-6"
          >
            {FEATURES.map((f) => (
              <div key={f.text} title={f.text} className="w-9 h-9 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                <f.icon className="w-4 h-4 text-cyan-400" />
              </div>
            ))}
          </motion.div>

          <div
            className="rounded-2xl p-8 relative"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              boxShadow: '0 0 0 1px rgba(6,182,212,0.05), 0 20px 60px -15px rgba(6,182,212,0.15), 0 8px 24px -8px rgba(0,0,0,0.4)',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-2xl font-bold text-white mb-1"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-slate-400 text-sm mb-6"
            >
              Sign in to your account to continue
            </motion.p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldError(null) }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={fieldError === 'email'}
                    className={`input-premium w-full pl-10 pr-4 py-3 transition-shadow ${fieldError === 'email' ? 'border-red-500/60 focus:ring-red-500/40' : ''}`}
                  />
                </div>
              </motion.div>

              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors relative group">
                    Forgot password?
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-200" />
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={checkCapsLock}
                    onKeyDown={checkCapsLock}
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
                {capsLockOn && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-amber-400 mt-1.5"
                  >
                    <ArrowUp className="w-3 h-3" /> Caps Lock is on
                  </motion.p>
                )}
              </motion.div>

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

              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015, boxShadow: loading ? undefined : '0 8px 24px -4px rgba(6,182,212,0.4)' }}
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
              </motion.div>
            </form>

            <motion.p
              custom={3}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="text-center text-sm text-slate-400 mt-6"
            >
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium relative group">
                Sign up
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-300 group-hover:w-full transition-all duration-200" />
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
