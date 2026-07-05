import { Link } from 'react-router-dom'
import { Film } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#workflow' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Marketplace', href: '/marketplace' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="px-6 py-14 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-semibold text-sm text-white">AI Creator Pro</span>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-[220px]">
            Prompt in, finished video out — script, voice, music and subtitles handled by one pipeline.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-slate-800/60 text-xs text-slate-600">
        © {new Date().getFullYear()} AI Creator Pro. All rights reserved.
      </div>
    </footer>
  )
}
