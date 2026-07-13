import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Film, Mail, Lock, Loader2, AlertCircle, Check, Gift, Globe2, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { applyReferral } from '../lib/render'

export default function Register() {
  const { signUp, session, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref') ?? ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [acceptTos, setAcceptTos] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)

  const benefits = ['100 free AI credits', 'AI script + voice generation', 'HD video exports', 'No credit card required']

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null)
    setOauthLoading(provider)
    const { error: err } = await signInWithOAuth(provider)
    setOauthLoading(null)
    if (err) {
      setError(err)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) return
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!acceptTos) {
      setError('You must accept the Terms of Service to continue.')
      return
    }
    setLoading(true)
    const { error: err, session: newSession } = await signUp(email.trim(), password) as { error: string | null; session?: typeof session }
    if (err) {
      setLoading(false)
      setError(err)
      return
    }
    // Apply referral code if present
    if (refCode && newSession) {
      await applyReferral(refCode, newSession).catch(() => null)
    }
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-2 gap-12 items-center"
      >
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Creator Pro
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Create viral videos with a single prompt.
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            AI scripts, voice synthesis, and video generation — all in one place.
          </p>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                {b}
              </li>
            ))}
          </ul>
          {refCode && (
            <div className="mt-6 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
              <Gift className="w-4 h-4" />
              <span>Referred by <code className="font-mono">{refCode}</code> — apply it after signing up to claim your bonus credits.</span>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Creator Pro
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-6">Start creating with 100 free credits</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-600"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${acceptTos ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600'}`}
                onClick={() => setAcceptTos(!acceptTos)}>
                {acceptTos && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-slate-400">
                I agree to the{' '}
                <Link to="/terms" className="text-cyan-400 hover:text-cyan-300" target="_blank">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300" target="_blank">Privacy Policy</Link>
              </span>
            </label>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              disabled={oauthLoading !== null}
              onClick={() => handleOAuth('google')}
              className="w-full py-3 border border-slate-700 rounded-lg font-semibold text-slate-200 hover:border-cyan-400/60 transition-all flex items-center justify-center gap-2"
            >
              {oauthLoading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe2 className="w-4 h-4" />}
              Continue with Google
            </button>
            <button
              type="button"
              disabled={oauthLoading !== null}
              onClick={() => handleOAuth('github')}
              className="w-full py-3 border border-slate-700 rounded-lg font-semibold text-slate-200 hover:border-cyan-400/60 transition-all flex items-center justify-center gap-2"
            >
              {oauthLoading === 'github' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Continue with GitHub
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
