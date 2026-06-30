import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Film, ArrowLeft } from 'lucide-react'

export default function Terms() {
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
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-slate-500 text-sm mb-10">Last updated: {updated}</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of terms</h2>
              <p className="text-slate-400 leading-relaxed">
                By creating an account and using AI Creator Pro ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Description of service</h2>
              <p className="text-slate-400 leading-relaxed">
                AI Creator Pro provides AI-powered tools for video content creation including script generation, voice synthesis, and video rendering. The Service is provided on a subscription and credit basis.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Account registration</h2>
              <p className="text-slate-400 leading-relaxed">
                You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Credits and billing</h2>
              <p className="text-slate-400 leading-relaxed">
                Credits are consumed when you use AI generation features. Credits are non-refundable except in cases of service errors. Subscription fees are billed monthly or annually as selected. Subscriptions renew automatically until cancelled.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Acceptable use</h2>
              <p className="text-slate-400 leading-relaxed">
                You agree not to use the Service to generate content that is unlawful, harmful, defamatory, infringing on third-party intellectual property rights, or violates any applicable law. We reserve the right to suspend accounts that violate this policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Intellectual property</h2>
              <p className="text-slate-400 leading-relaxed">
                You retain ownership of content you create using the Service. You grant us a limited licence to process your inputs to provide the Service. We retain all rights to the underlying platform, models, and technology.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Limitation of liability</h2>
              <p className="text-slate-400 leading-relaxed">
                To the maximum extent permitted by law, AI Creator Pro shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Termination</h2>
              <p className="text-slate-400 leading-relaxed">
                You may cancel your account at any time from the Billing page. We may suspend or terminate accounts that violate these terms. Upon termination, your data may be deleted after 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Governing law</h2>
              <p className="text-slate-400 leading-relaxed">
                These terms shall be governed by applicable law. Any disputes shall be resolved through binding arbitration, except where prohibited by local law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. Contact</h2>
              <p className="text-slate-400 leading-relaxed">
                For any questions regarding these Terms, please contact us at <span className="text-cyan-400">support@aicreatorpro.com</span>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between text-sm text-slate-500">
            <span>© {new Date().getFullYear()} AI Creator Pro</span>
            <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
