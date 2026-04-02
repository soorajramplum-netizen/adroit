# The Script Brain

Behavioral science-powered, second-by-second, shoot-ready ad script generator.

Built on 8 books of research across System 1 thinking, attention economics, cognitive biases, showmanship vs salesmanship, and psycho-logic principles.

---

## Stack

- **Next.js 14** (Pages Router)
- **AI Fallback Chain**: Gemini → Groq → OpenRouter
- **Deploy**: Vercel (one click)

---

## Local Setup

```bash
git clone <your-repo>
cd script-brain
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add these **Environment Variables** in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key |
| `GROQ_API_KEY` | Your Groq API key |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |

4. Deploy — done.

---

## AI Fallback Chain

**Tier 1 — Gemini** (tried first, most capable)
→ gemini-2.5-pro-preview-06-05 → gemini-2.5-pro → gemini-2.0-flash-preview → gemini-2.5-flash → gemini-2.5-flash-lite-preview → gemini-2.5-flash-lite

**Tier 2 — Groq** (fast fallback)
→ llama-3.3-70b-versatile → llama-3.1-70b-versatile → mixtral-8x7b-32768 → llama3-70b-8192 → gemma2-9b-it

**Tier 3 — OpenRouter** (free final fallback)
→ llama-3.3-70b → mixtral-8x7b → gemma-2-9b → llama-3.1-8b

---

## Output Columns

| # | Column | What it contains |
|---|---|---|
| ① | Time | Exact second range (e.g. 0s–3s) |
| ② | Scene | Shoot-ready visual description |
| ③ | Shot type | Camera language for the DOP |
| ④ | Script & dialogue | Exact words / on-screen text |
| ⑤ | Music & SFX | Sound design per scene |
| ⑥ | Scene goal | HOOK / PEAK / RESOLUTION / CTA etc. |

Plus: **Know the science behind this** — collapsible section with full behavioral science breakdown.

---

## Important: API Keys

`.env.local` is gitignored — your keys will never be committed to GitHub. Always add keys directly in Vercel's dashboard for production.
