import { Link } from 'react-router-dom'
import { Film, ArrowLeft, Key, Zap, AlertCircle } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed">
      <code>{children}</code>
    </pre>
  )
}

function Endpoint({ method, path, credits, description, example, response }: {
  method: string
  path: string
  credits: string
  description: string
  example: string
  response: string
}) {
  return (
    <div className="border-t border-slate-800 py-8 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold">{method}</span>
        <code className="text-sm text-white font-mono">{path}</code>
        <span className="flex items-center gap-1 text-xs text-amber-400 ml-auto">
          <Zap className="w-3 h-3" /> {credits}
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <p className="text-xs text-slate-500 mb-1.5 font-medium">Request</p>
      <CodeBlock>{example}</CodeBlock>
      <p className="text-xs text-slate-500 mb-1.5 mt-3 font-medium">Response</p>
      <CodeBlock>{response}</CodeBlock>
    </div>
  )
}

export default function ApiDocs() {
  useSEO('API Documentation', 'Call the AI Creator Pro script, voice, video and subtitles endpoints programmatically with a developer API key.')
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to app
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Creator Pro API</h1>
        </div>
        <p className="text-slate-400 mb-10">
          Every endpoint below is the exact same one the web app uses — nothing is a separate, watered-down public API surface.
        </p>

        <div className="glass-card p-6 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Authentication</h2>
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Generate a key from <Link to="/settings" className="text-cyan-400 hover:text-cyan-300">Settings → Developer API</Link>, then send it as a Bearer token:
          </p>
          <CodeBlock>{`Authorization: Bearer aicp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</CodeBlock>
          <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              Requests are billed against your account's credits, exactly like using the app — unless you've added your own provider key in Settings → API Keys, in which case that request costs 0 credits.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 mb-10">
          <h2 className="text-sm font-semibold text-white mb-2">Base URL</h2>
          <CodeBlock>{BASE_URL}</CodeBlock>
          <p className="text-xs text-slate-500 mt-3">
            Rate limits apply per endpoint (typically 5–15 requests per 5–10 minutes). A 429 response includes a <code className="text-slate-400">Retry-After</code> header.
          </p>
        </div>

        <div className="glass-card p-6">
          <Endpoint
            method="POST"
            path="/ai-script"
            credits="2 credits"
            description="Generate a scripted video outline (title, hook, scenes) from a prompt."
            example={`curl -X POST ${BASE_URL}/ai-script \\
  -H "Authorization: Bearer $AICP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "5 tips for better sleep",
    "style": "tutorial",
    "tone": "casual",
    "durationSec": 45
  }'`}
            response={`{
  "title": "5 Sleep Tips That Actually Work",
  "hook": "Struggling to fall asleep? You're doing it wrong.",
  "scenes": [ { "id": 1, "heading": "Intro", "narration": "...", "visuals": "...", "durationSec": 5 } ],
  "totalDurationSec": 45,
  "creditsCost": 2,
  "jobId": "..."
}`}
          />

          <Endpoint
            method="POST"
            path="/ai-voice"
            credits="5 credits"
            description="Text-to-speech narration (ElevenLabs). Returns a hosted MP3 URL."
            example={`curl -X POST ${BASE_URL}/ai-voice \\
  -H "Authorization: Bearer $AICP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Struggling to fall asleep? You are doing it wrong.",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  }'`}
            response={`{
  "audioUrl": "https://...supabase.co/storage/v1/object/public/ai-assets/voice/...",
  "creditsCost": 5,
  "jobId": "..."
}`}
          />

          <Endpoint
            method="POST"
            path="/ai-video"
            credits="25–50 credits (provider-dependent)"
            description="Submit a text-to-video generation job. Runs async — poll with GET below."
            example={`curl -X POST ${BASE_URL}/ai-video \\
  -H "Authorization: Bearer $AICP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A calm bedroom at night, soft blue lighting",
    "provider": "runway",
    "durationSec": 5,
    "aspectRatio": "16:9"
  }'`}
            response={`{
  "provider": "runway",
  "providerJobId": "...",
  "jobId": "...",
  "creditsCost": 25,
  "status": "processing",
  "message": "Video generation started. Poll status via GET /ai-video?jobId=..."
}`}
          />

          <Endpoint
            method="GET"
            path="/ai-video?jobId={id}"
            credits="free — polling only"
            description="Poll a submitted video job until the provider finishes rendering."
            example={`curl "${BASE_URL}/ai-video?jobId=YOUR_JOB_ID" \\
  -H "Authorization: Bearer $AICP_API_KEY"`}
            response={`{
  "status": "completed",
  "resultUrl": "https://...",
  "error": null
}`}
          />

          <Endpoint
            method="POST"
            path="/ai-subtitles"
            credits="3 credits"
            description="Transcribe an audio/video URL into timestamped caption segments (Whisper)."
            example={`curl -X POST ${BASE_URL}/ai-subtitles \\
  -H "Authorization: Bearer $AICP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sourceUrl": "https://.../voice.mp3",
    "language": "en"
  }'`}
            response={`{
  "jobId": "...",
  "segments": [ { "start": 0.0, "end": 2.4, "text": "Struggling to fall asleep?" } ],
  "language": "en",
  "creditsCost": 3
}`}
          />
        </div>

        <p className="text-center text-xs text-slate-600 mt-10">
          Questions or found an issue? Reach out from your account settings.
        </p>
      </div>
    </div>
  )
}
