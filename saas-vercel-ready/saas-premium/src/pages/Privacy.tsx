import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Film, ArrowLeft } from 'lucide-react'

export default function Privacy() {
  const updated = 'June 2025'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Creator Pro
            </span>
          </div>
          <Link to="/register" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-500 text-sm mb-10">Last updated: {updated}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Data we collect</h2>
              <p className="text-slate-400 leading-relaxed">
                We collect: your email address and password (hashed) at registration; content you create (prompts, scripts, audio, video); usage data (credits spent, render jobs, feature usage); payment information processed by Stripe (we never store card numbers).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. How we use your data</h2>
              <p className="text-slate-400 leading-relaxed">
                We use your data to: provide and improve the Service; process payments; send transactional emails (account confirmation, render notifications, billing receipts); detect and prevent fraud or abuse; comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Data sharing</h2>
              <p className="text-slate-400 leading-relaxed">
                We do not sell your personal data. We share data only with: infrastructure providers (Supabase for database/auth, Stripe for payments, Resend for email, OpenAI/ElevenLabs for AI generation) under contractual data processing agreements.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Data retention</h2>
              <p className="text-slate-400 leading-relaxed">
                Account data is retained for the duration of your account. After account deletion, data is removed within 30 days. Anonymised analytics may be retained longer.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Your rights</h2>
              <p className="text-slate-400 leading-relaxed">
                You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <span className="text-cyan-400">privacy@aicreatorpro.com</span>. You may also delete your account directly from your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Cookies</h2>
              <p className="text-slate-400 leading-relaxed">
                We use only essential cookies required for authentication and session management. We do not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Security</h2>
              <p className="text-slate-400 leading-relaxed">
                We use industry-standard security practices including encrypted connections (HTTPS), hashed passwords, and Row Level Security on all database tables. However, no system is completely secure — we encourage you to use a strong, unique password.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Contact</h2>
              <p className="text-slate-400 leading-relaxed">
                For privacy enquiries, contact us at <span className="text-cyan-400">privacy@aicreatorpro.com</span>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between text-sm text-slate-500">
            <span>© {new Date().getFullYear()} AI Creator Pro</span>
            <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
