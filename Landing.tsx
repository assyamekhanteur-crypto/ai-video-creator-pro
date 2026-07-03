import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Film, Sparkles, Mic2, Clapperboard, LayoutTemplate, BarChart3,
  ArrowRight, Check, ChevronDown, Play, Zap, Crown, Building, FileText,
} from 'lucide-react'

// ---------- Shared bits ----------

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
        <Film className="w-5 h-5 text-white" />
      </div>
      <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        AI Creator Pro
      </span>
    </Link>
  )
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ---------- Pipeline signature visual ----------

const PIPELINE_STEPS = [
  { label: 'Script', icon: FileText, color: 'from-cyan-400 to-cyan-600' },
  { label: 'Voix', icon: Mic2, color: 'from-blue-400 to-blue-600' },
  { label: 'Vidéo', icon: Clapperboard, color: 'from-indigo-400 to-indigo-600' },
  { label: 'Export', icon: Sparkles, color: 'from-violet-400 to-violet-600' },
]

function PipelineVisual() {
  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xs shadow-premium p-6 sm:p-8">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex flex-col items-center gap-2 shrink-0"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-glow-cyan`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-300">{step.label}</span>
            </motion.div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 sm:mx-2 relative overflow-hidden bg-slate-800">
                <motion.div
                  className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs sm:text-sm text-slate-500 mt-6">
        Un prompt entre, une vidéo prête à publier sort.
      </p>
    </div>
  )
}

// ---------- Editor mockup (CSS-built, no fake screenshots) ----------

function EditorMockup() {
  const tracks = [
    { name: 'Voix off', color: 'bg-cyan-500/40', segments: [[4, 34], [42, 78]] },
    { name: 'Vidéo IA', color: 'bg-indigo-500/40', segments: [[0, 100]] },
    { name: 'Musique', color: 'bg-violet-500/40', segments: [[0, 60], [65, 90]] },
    { name: 'Sous-titres', color: 'bg-blue-500/40', segments: [[6, 30], [36, 60], [66, 88]] },
  ]
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-premium overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        <span className="ml-3 text-xs text-slate-500">Editor — leo-tresor-magique.mp4</span>
      </div>
      <div className="aspect-video bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-center relative">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center">
          <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
        </div>
        <div className="absolute bottom-3 left-3 right-3 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-2/5 bg-gradient-to-r from-cyan-400 to-blue-500" />
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        {tracks.map((track) => (
          <div key={track.name} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-[11px] text-slate-500">{track.name}</span>
            <div className="relative flex-1 h-5 rounded-md bg-slate-950 overflow-hidden">
              {track.segments.map(([start, end], i) => (
                <div
                  key={i}
                  className={`absolute inset-y-0.5 rounded ${track.color}`}
                  style={{ left: `${start}%`, width: `${end - start}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Feature data ----------

const FEATURES = [
  { icon: FileText, title: 'Script par IA', desc: 'Décris ton idée, l\u2019IA structure un script complet avec scènes, timing et accroche.' },
  { icon: Mic2, title: 'Voix off réaliste', desc: 'Génère une narration naturelle dans la langue et le ton de ton choix.' },
  { icon: Clapperboard, title: 'Génération vidéo', desc: 'Transforme chaque scène en vidéo grâce aux moteurs de génération connectés.' },
  { icon: Sparkles, title: 'Pipeline Autopilot', desc: 'Lance tout le processus d\u2019un coup : script, voix, vidéo, assemblage et export.' },
  { icon: LayoutTemplate, title: 'Marketplace', desc: 'Templates, voix et transitions prêts à l\u2019emploi, créés par la communauté.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Suis tes rendus, ton usage de crédits et la performance de tes vidéos.' },
]

const PLANS = [
  { id: 'free', name: 'Free', price: 0, credits: 100, icon: Zap, color: 'slate', features: ['100 crédits IA / mois', 'Exports 720p', 'Filigrane sur les exports', 'Templates de base'] },
  { id: 'pro', name: 'Pro', price: 29, credits: 2000, icon: Crown, color: 'cyan', popular: true, features: ['2000 crédits IA / mois', 'Exports 4K', 'Sans filigrane', 'Rendu prioritaire', 'Templates avancés'] },
  { id: 'business', name: 'Business', price: 99, credits: 10000, icon: Building, color: 'violet', features: ['10 000 crédits IA / mois', 'Exports 4K', 'Rendu le plus rapide', 'Collaboration d\u2019équipe', 'Accès API'] },
]

const TESTIMONIALS = [
  { name: 'Camille R.', role: 'Créatrice YouTube, chaîne jeunesse', quote: 'Je produis en une soirée ce qui me prenait une semaine complète avant, montage compris.' },
  { name: 'Yanis B.', role: 'Growth chez une agence social media', quote: 'Le pipeline complet script → vidéo nous permet de tester dix idées là où on en testait deux.' },
  { name: 'Nora K.', role: 'Formatrice en ligne', quote: 'Mes vidéos de formation sortent avec une voix off propre sans jamais toucher un micro.' },
]

const FAQS = [
  { q: 'Ai-je besoin d\u2019une carte bancaire pour commencer ?', a: 'Non. Le plan Free inclut 100 crédits IA par mois, sans carte bancaire requise.' },
  { q: 'Que sont les crédits IA ?', a: 'Chaque étape du pipeline (script, voix, génération vidéo) consomme des crédits selon sa complexité. Le nombre de crédits dépend de ton plan et se renouvelle chaque mois.' },
  { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, tu peux passer à un plan supérieur ou inférieur depuis la page Facturation, à tout moment.' },
  { q: 'Les vidéos générées sont-elles libres de droits ?', a: 'Les vidéos que tu génères t\u2019appartiennent et peuvent être publiées commercialement, selon les conditions d\u2019utilisation détaillées dans nos CGU.' },
  { q: 'Quels formats d\u2019export sont disponibles ?', a: 'Export 720p sur le plan Free, jusqu\u2019à 4K sur les plans Pro et Business, dans les ratios les plus courants (16:9, 9:16, 1:1).' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-800 py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <span className="font-medium text-slate-100">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-sm text-slate-400 mt-3 leading-relaxed">{a}</p>}
    </div>
  )
}

// ---------- Page ----------

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#how" className="hover:text-white transition-colors">Comment ça marche</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-2">
              Se connecter
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-radial from-indigo-950/40 via-transparent to-transparent -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-xs text-slate-400 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Script, voix et vidéo générés par IA, dans un seul pipeline
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]"
        >
          D'une idée à une vidéo
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            publiable, sans monter à la main
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto"
        >
          AI Creator Pro écrit le script, génère la voix, produit la vidéo et l'assemble automatiquement.
          Tu gardes le contrôle créatif dans un éditeur professionnel, sans repartir de zéro.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4 flex-wrap"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Commencer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 font-medium text-slate-200 hover:bg-slate-900 transition-all"
          >
            <Play className="w-4 h-4" /> Voir comment ça marche
          </a>
        </motion.div>

        <p className="mt-4 text-xs text-slate-500">100 crédits offerts · Aucune carte bancaire requise</p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <PipelineVisual />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-bold">Tout le pipeline créatif, dans un seul outil</h2>
            <p className="text-slate-400 mt-3">Chaque brique fonctionne seule, ou s'enchaîne automatiquement avec Autopilot.</p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="h-full p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works + mockup */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div>
              <h2 className="text-3xl font-bold mb-8">De l'idée à l'export, quatre étapes</h2>
              <ol className="space-y-6">
                {[
                  { title: 'Décris ta vidéo', desc: 'Un prompt, un sujet, ou un script existant à améliorer.' },
                  { title: 'L\u2019IA génère script, voix et vidéo', desc: 'Chaque scène est écrite, narrée et illustrée automatiquement.' },
                  { title: 'Ajuste dans l\u2019éditeur', desc: 'Timeline, calques, transitions et sous-titres, comme dans un vrai éditeur.' },
                  { title: 'Exporte et publie', desc: 'Rendu jusqu\u2019en 4K, prêt pour YouTube, TikTok ou Instagram.' },
                ].map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-semibold text-cyan-400">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <EditorMockup />
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-bold">Un tarif qui suit ta production</h2>
            <p className="text-slate-400 mt-3">Change de plan à tout moment. Les crédits inutilisés ne sont pas cumulés.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.08}>
              <div
                className={`h-full flex flex-col p-7 rounded-2xl border ${
                  plan.popular ? 'border-cyan-500/40 bg-slate-900 shadow-glow-cyan' : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                {plan.popular && (
                  <span className="self-start mb-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    Le plus populaire
                  </span>
                )}
                <plan.icon className={`w-6 h-6 mb-3 ${plan.popular ? 'text-cyan-400' : 'text-slate-400'}`} />
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 mb-1 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price === 0 ? 'Gratuit' : `${plan.price}€`}</span>
                  {plan.price > 0 && <span className="text-sm text-slate-500">/ mois</span>}
                </div>
                <p className="text-xs text-slate-500 mb-6">{plan.credits.toLocaleString('fr-FR')} crédits IA / mois</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`text-center py-2.5 rounded-lg font-medium text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {plan.price === 0 ? 'Commencer gratuitement' : 'Choisir ce plan'}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-bold text-center mb-14">Ce que les créateurs en disent</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="h-full p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                <p className="text-slate-200 leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <Reveal>
          <div className="relative overflow-hidden text-center rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 px-8 py-16">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-3xl rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-bold relative">Prêt à créer ta prochaine vidéo ?</h2>
            <p className="text-slate-400 mt-3 relative">100 crédits offerts. Aucune carte bancaire requise.</p>
            <Link
              to="/register"
              className="relative mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Essayer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Conditions</Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Confidentialité</Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">Se connecter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
