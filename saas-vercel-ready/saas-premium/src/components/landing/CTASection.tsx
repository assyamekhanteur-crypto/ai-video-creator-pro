import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="px-6 py-24 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto glass-panel rounded-3xl px-8 py-14 md:py-16 text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative">
          <h2 className="font-display font-bold text-3xl md:text-[2.75rem] tracking-tight text-white leading-tight">
            Your next video is one prompt away
          </h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto">
            100 free credits every month. No card required, no editing timeline to learn.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 gradient-btn-primary text-white font-medium px-7 py-3.5 rounded-xl"
          >
            Start creating free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
