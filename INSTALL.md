# 📦 Installation Guide

Welcome to **AI Creator Pro**.

This guide will help you install and configure the project in just a few minutes.

---

# Requirements

Before getting started, make sure you have:

- Node.js 20+
- npm 10+
- Git
- A Supabase account
- A Stripe account (optional)
- AI provider API keys (OpenAI, ElevenLabs, Runway, Kling, etc.)

---

# Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-creator-pro.git
cd ai-creator-pro
```

---

# Install dependencies

```bash
npm install
```

---

# Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

OPENAI_API_KEY=

ELEVENLABS_API_KEY=

RUNWAY_API_KEY=

KLING_API_KEY=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=
```

---

# Configure Supabase

1. Create a new Supabase project.
2. Copy the Project URL.
3. Copy the Anon Key.
4. Paste both values into your `.env`.

---

# Configure Stripe

Create:

- Products
- Prices
- Webhooks

Then update:

```
STRIPE_SECRET_KEY
```

---

# Configure AI Providers

Supported providers include:

- OpenAI
- ElevenLabs
- Runway
- Kling
- Google Veo

You can replace them with your own providers if needed.

---

# Run Development Server

```bash
npm run dev
```

Application:

```
http://localhost:5173
```

---

# Production Build

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

# Deploy

Recommended platforms:

- Vercel
- Netlify
- Railway
- Render

---

# Project Structure

```
src/

components/

pages/

contexts/

hooks/

services/

lib/

utils/

assets/
```

---

# Security

Never commit:

- .env
- API Keys
- Secrets

Use `.env.example` instead.

---

# Troubleshooting

### Build fails

```bash
rm -rf node_modules

npm install
```

---

### TypeScript errors

```bash
npm run build
```

Fix reported issues before deploying.

---

# Support

If you purchased a commercial license and need assistance, please contact the seller.

---

Thank you for using AI Creator Pro ❤️
