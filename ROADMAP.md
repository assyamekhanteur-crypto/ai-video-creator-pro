# AI Creator Pro

An AI video creation SaaS: turn a text prompt into a scripted, narrated, captioned video. Built with React + TypeScript + Vite on the frontend, Supabase (Postgres, Auth, Storage, Edge Functions) on the backend, and Stripe for billing.

**Live demo:** https://sasa-lyart-eta.vercel.app

## What actually works today

This list reflects the real, tested state of the codebase — not the aspirational feature list from early planning docs.

- **Auth** — email/password sign up, sign in, password reset, session persistence (Supabase Auth)
- **AI pipeline** — prompt → script (OpenAI GPT-4o-mini) → voiceover (ElevenLabs) → video (Runway Gen-3 Turbo / Kling / Google Veo 3.1) → auto-transcribed captions (OpenAI Whisper), each step a real API call, real async job tracking, real credit deduction
- **Video editor** — timeline with drag-to-move and drag-to-trim clips, split, undo/redo, a real HTML5 video/audio preview player synced to the playhead, a media bin pulling in the AI assets actually generated for that project, caption overlay rendering
- **Dashboard / Analytics / Projects** — all backed by real Supabase queries, no mock/placeholder data
- **Marketplace** — internal credits-based store (real purchase flow via a `SECURITY DEFINER` Postgres function), not a real-money multi-vendor marketplace with creator payouts
- **Autopilot** — generates a week of real AI scripts (OpenAI) you can turn into projects; does not publish to social platforms (no OAuth integrations exist for that)
- **Billing** — real Stripe Checkout + webhook-driven subscription/credit provisioning
- **Settings** — profile editing, password change, and a real (irreversible) account deletion flow

## Known limitations — read before you buy or extend this

Being upfront about this now saves a buyer from finding it during due diligence:

- **No automated tests.** No Vitest/Playwright coverage exists yet.
- **No error monitoring** (no Sentry or equivalent) in production.
- **Generated video URLs point directly at the provider** (Runway/Kling/Google), not a re-hosted copy in Supabase Storage. Some providers expire these URLs after a retention window.
- **No OAuth login** (Google/GitHub/etc.) — email/password only.
- **No team/role permissions** beyond a single `is_admin` boolean.
- **Effects, transitions, and keyframes** are supported in the editor's Zustand store (`src/stores/editorStore.ts`) but have no UI wired up yet.
- **Editor preview only composites one active video track at a time** — no true multi-layer video compositing.

## Tech stack

- **Frontend:** React 18, TypeScript (strict), Vite, Tailwind CSS, Zustand, Framer Motion, React Router
- **Backend:** Supabase (Postgres + RLS, Auth, Storage, Edge Functions on Deno)
- **AI providers:** OpenAI (script + Whisper transcription), ElevenLabs (voice), Runway / Kling / Google Veo (video)
- **Billing:** Stripe (Checkout + Webhooks)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Frontend environment variables

Create `.env` in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase project setup

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

This applies every migration in `supabase/migrations/` — schema, RLS policies, and the `is_user_admin()` / `purchase_marketplace_item()` helper functions.

### 4. Deploy Edge Functions

```bash
supabase functions deploy ai-script
supabase functions deploy ai-voice
supabase functions deploy ai-video
supabase functions deploy ai-subtitles
supabase functions deploy submit-render
supabase functions deploy render-processor
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy send-email
supabase functions deploy apply-referral
supabase functions deploy delete-account
```

### 5. Configure Edge Function secrets

In your Supabase project (Dashboard → Edge Functions → Secrets, or via CLI):

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set ELEVENLABS_API_KEY=...
supabase secrets set RUNWAY_API_KEY=...
supabase secrets set GOOGLE_AI_API_KEY=...       # optional — only for the Veo provider
supabase secrets set STRIPE_SECRET_KEY=...
supabase secrets set STRIPE_WEBHOOK_SECRET=...
supabase secrets set RESEND_API_KEY=...          # transactional email
supabase secrets set EMAIL_FROM=noreply@yourdomain.com
supabase secrets set APP_URL=https://yourdomain.com
```

(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to every Edge Function by Supabase — no need to set them yourself.)

### 6. Run locally

```bash
npm run dev
```

### 7. Deploy the frontend

The project builds with `npm run build` (outputs to `dist/`) and deploys cleanly to Vercel or Netlify — both `vercel.json` and `netlify.toml` are included.

## Credit economy

Credits are pegged at roughly **1 credit ≈ $0.01 of real provider cost**, so the price stays consistent regardless of which AI provider a user picks:

| Action | Credits | Real cost basis |
|---|---|---|
| Script (GPT-4o-mini) | 2 | ~$0.001 |
| Voice (ElevenLabs) | 5 | ~$0.045 / 30s |
| Video — Runway | 25 | ~$0.25 / 5s |
| Video — Kling | 40 | ~$0.40 / 5s |
| Video — Google Veo | 50 | ~$0.50 / 5s |
| Subtitles (Whisper) | 3 | ~$0.006/min |

Plans: Free (100 credits), Pro ($29/mo, 700 credits), Business ($99/mo, 2400 credits) — sized so worst-case usage stays around 75% gross margin. See `supabase/functions/ai-video/index.ts` and `src/contexts/AuthContext.tsx` (`CREDIT_LIMITS`) if you adjust pricing.

## Project structure

```
src/
  components/
    editor/       # Timeline, PreviewPlayer, MediaBin, PropertiesPanel
    landing/       # Public marketing page sections
    layout/        # Authenticated app shell (sidebar, nav)
  contexts/        # AuthContext (session, profile, credit limits)
  lib/             # Supabase client, AI/render API wrappers
  pages/           # Route-level components
  stores/          # Zustand editor state (tracks, clips, undo/redo)
  types/           # Shared TypeScript types

supabase/
  functions/       # Deno Edge Functions (one per AI/billing operation)
  migrations/       # SQL migrations, applied in filename order
```

## License

MIT — see [LICENSE](./LICENSE).
