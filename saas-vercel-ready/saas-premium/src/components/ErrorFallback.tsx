import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorFallback({ resetError }: { resetError: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 text-sm mb-6">
          This has been reported automatically. Try reloading the page — if it keeps happening, let us know.
        </p>
        <button
          onClick={() => { resetError(); window.location.href = '/' }}
          className="gradient-btn-primary w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reload
        </button>
      </div>
    </div>
  )
}
