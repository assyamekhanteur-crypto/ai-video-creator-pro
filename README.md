Créateur d'IA Pro
Une solution SaaS de création vidéo par IA : transformez une simple invite textuelle en une vidéo scénarisée, commentée et sous-titrée. Développée avec React, TypeScript et Vite côté client, Supabase (PostgreSQL, authentification, stockage, fonctions Edge) côté serveur et Stripe pour la facturation.

Démo en direct : https://sasa-lyart-eta.vercel.app

Ce qui fonctionne réellement aujourd'hui
Cette liste reflète l'état réel et testé du code source, et non la liste des fonctionnalités souhaitées figurant dans les premiers documents de planification.

Authentification — inscription par e-mail/mot de passe, connexion, réinitialisation du mot de passe, persistance de session (Authentification Supabase)
Pipeline IA — invite → script (OpenAI GPT-4o-mini) → voix off (ElevenLabs) → vidéo (Runway Gen-3 Turbo / Kling / Google Veo 3.1) → sous-titres auto-transcrits (OpenAI Whisper), chaque étape correspondant à un véritable appel API, suivi asynchrone des tâches et déduction de crédits réels.
Éditeur vidéo : timeline avec glisser-déposer et découpage des clips, fractionnement, annulation/rétablissement, lecteur de prévisualisation audio/vidéo HTML5 synchronisé avec la tête de lecture, bibliothèque multimédia important les ressources IA générées pour le projet, rendu des sous-titres.
Tableau de bord / Analyses / Projets — le tout basé sur de véritables requêtes Supabase, sans données fictives ni de substitution.
Marketplace — boutique interne fonctionnant avec un système de crédits (flux d'achat réel via une SECURITY DEFINERfonction Postgres), et non une place de marché multi-vendeurs avec rémunération des créateurs et paiement en argent réel.
Autopilot génère une semaine de scripts d'IA réels (OpenAI) que vous pouvez transformer en projets ; ne publie pas sur les plateformes sociales (aucune intégration OAuth n'existe pour cela).
Facturation — véritable système Stripe Checkout + abonnement/provisionnement de crédit par webhook
Paramètres — modification du profil, changement de mot de passe et procédure de suppression de compte définitive.
Limitations connues — à lire avant d'acheter ou de prolonger ce contrat
Le fait d'être transparent dès maintenant évite à l'acheteur de le découvrir lors des vérifications préalables :

Aucun test automatisé. Aucune couverture Vitest/Playwright n'est disponible pour le moment.
Aucun système de surveillance des erreurs (ni Sentry ni équivalent) en production.
Les URL des vidéos générées pointent directement vers le fournisseur (Runway/Kling/Google), et non vers une copie hébergée dans Supabase Storage. Certains fournisseurs font expirer ces URL après une période de conservation.
Pas de connexion OAuth (Google/GitHub/etc.) — uniquement email/mot de passe.
Aucune autorisation d'équipe/de rôle au-delà d'un simple is_adminbooléen.
Les effets, les transitions et les images clés sont pris en charge dans le magasin Zustand de l'éditeur ( src/stores/editorStore.ts) mais n'ont pas encore d'interface utilisateur connectée.
L'aperçu de l'éditeur ne permet de composer qu'une seule piste vidéo active à la fois — il n'y a pas de véritable composition vidéo multicouche.
Pile technologique
Côté client : React 18, TypeScript (strict), Vite, Tailwind CSS, Zustand, Framer Motion, React Router
Backend : Supabase (Postgres + RLS, authentification, stockage, fonctions périphériques sur Deno)
Fournisseurs d'IA : OpenAI (script + transcription Whisper), ElevenLabs (voix), Runway / Kling / Google Veo (vidéo)
Facturation : Stripe (Paiement + Webhooks)
Commencer
1. Installer les dépendances
npm install
2. Variables d'environnement du frontend
Créer .envdans la racine du projet :

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
3. Configuration du projet Supabase
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
Cela s'applique à toutes les migrations, notamment au niveau supabase/migrations/du schéma, des politiques RLS et des fonctions d' is_user_admin()assistance purchase_marketplace_item().

4. Déployer les fonctions périphériques
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
5. Configurer les secrets de la fonction Edge
Dans votre projet Supabase (Tableau de bord → Fonctions Edge → Secrets, ou via l'interface de ligne de commande) :

supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set ELEVENLABS_API_KEY=...
supabase secrets set RUNWAY_API_KEY=...
supabase secrets set GOOGLE_AI_API_KEY=...       # optional — only for the Veo provider
supabase secrets set STRIPE_SECRET_KEY=...
supabase secrets set STRIPE_WEBHOOK_SECRET=...
supabase secrets set RESEND_API_KEY=...          # transactional email
supabase secrets set EMAIL_FROM=noreply@yourdomain.com
supabase secrets set APP_URL=https://yourdomain.com
( SUPABASE_URL, SUPABASE_ANON_KEY, et SUPABASE_SERVICE_ROLE_KEYsont fournis automatiquement à chaque fonction Edge par Supabase — il n'est pas nécessaire de les définir vous-même.)

6. Exécuter localement
npm run dev
7. Déployer l'interface utilisateur
Le projet est compilé avec npm run build(sorties vers dist/) et se déploie proprement sur Vercel ou Netlify — les deux vercel.jsonsont netlify.tomlinclus.

économie du crédit
Les crédits sont indexés à environ 1 crédit ≈ 0,01 $ du coût réel du fournisseur , de sorte que le prix reste constant quel que soit le fournisseur d'IA choisi par l'utilisateur :

Action	Crédits	base de coût réel
Script (GPT-4o-mini)	2	~0,001 $
Voix (ElevenLabs)	5	~0,045 $ / 30 s
Vidéo — Défilé	25	~0,25 $ / 5 s
Vidéo — Kling	40	~0,40 $ / 5 s
Vidéo — Google Veo	50	~0,50 $ / 5 s
Sous-titres (chuchotements)	3	~0,006 $/min
Abonnements : Gratuit (100 crédits), Pro (29 $/mois, 700 crédits), Business (99 $/mois, 2 400 crédits) — dimensionnés pour que la marge brute reste aux alentours de 75 % même en cas d’utilisation maximale. Voir supabase/functions/ai-video/index.tset src/contexts/AuthContext.tsx( CREDIT_LIMITS) si vous modifiez les prix.

structure du projet
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
Licence
MIT — voir LICENCE .
