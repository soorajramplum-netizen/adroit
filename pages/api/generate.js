import { BRAIN } from '../../lib/brain'

export const config = { maxDuration: 60 }

const GEMINI_MODELS = [
  'gemini-2.5-pro-preview-06-05',
  'gemini-2.5-pro',
  'gemini-2.0-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite-preview-06-17',
  'gemini-2.5-flash-lite',
]

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768',
  'llama3-70b-8192',
  'gemma2-9b-it',
]

const OPENROUTER_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mixtral-8x7b-instruct:free',
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
]

function extractJSON(text) {
  try { return JSON.parse(text) } catch {}
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try { return JSON.parse(cleaned) } catch {}
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try { return JSON.parse(match[0]) } catch {}
  }
  throw new Error('Could not parse JSON from model response')
}

// ── BRAND WEBSITE FETCHER ──────────────────────────────────────────────
async function fetchBrandContext(url) {
  if (!url) return null
  try {
    // Normalize URL
    let normalized = url.trim()
    if (!normalized.startsWith('http')) normalized = 'https://' + normalized

    const res = await fetch(normalized, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Androit/1.0; +https://androit.ai)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return null
    const html = await res.text()

    // Extract meaningful text — strip all tags, collapse whitespace
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Pull title and meta description specifically
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)

    const title = titleMatch?.[1]?.trim() || ''
    const desc = descMatch?.[1]?.trim() || ogDescMatch?.[1]?.trim() || ''
    const ogTitle = ogTitleMatch?.[1]?.trim() || ''

    // Grab the first ~1200 chars of visible text as brand voice sample
    const textSample = stripped.slice(0, 1200)

    return {
      url: normalized,
      title,
      ogTitle,
      description: desc,
      textSample,
    }
  } catch {
    return null
  }
}

function formatBrandContext(ctx) {
  if (!ctx) return 'No website provided.'
  return `
BRAND WEBSITE INTELLIGENCE (fetched live):
URL: ${ctx.url}
Page title: ${ctx.title || 'n/a'}
OG title: ${ctx.ogTitle || 'n/a'}
Meta description: ${ctx.description || 'n/a'}
Brand voice / visible text sample:
"${ctx.textSample}"

Use the above to understand the brand's tone of voice, visual world, value proposition, and target culture. Let it inform the creative direction naturally — do not copy it verbatim.`
}

// ── DIALOGUE INSTRUCTION BUILDER ─────────────────────────────────────
function dialogueInstruction(level) {
  const map = {
    heavy: `DIALOGUE LEVEL: Heavy — every scene should have spoken dialogue or a strong voiceover. Characters must speak. Silence and visual-only scenes should be rare exceptions (max 1 scene). Dialogue is the primary storytelling mechanism.`,
    moderate: `DIALOGUE LEVEL: Moderate — approximately half the scenes should have spoken dialogue or voiceover. Mix of visual storytelling and spoken language. No scene should have null or empty script.`,
    minimal: `DIALOGUE LEVEL: Minimal — use dialogue sparingly, only at the most emotionally critical moments (1–3 scenes maximum). Prioritize visual storytelling, performance, music, and action. When there is no dialogue, write exactly what the visual performance communicates instead of null.`,
    none: `DIALOGUE LEVEL: None — this is a pure visual/music execution. There is NO spoken dialogue and NO voiceover anywhere in the script. Every scene's "script" field must describe the visual performance, expressions, and actions in detail — never write null. Music and sound design carry all emotional communication.`,
  }
  return map[level] || map.moderate
}

async function tryGemini(userPrompt) {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: BRAIN }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
          }),
          signal: AbortSignal.timeout(45000),
        }
      )
      if (!res.ok) continue
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) continue
      return { parsed: extractJSON(text), model, tier: 'Gemini' }
    } catch { continue }
  }
  return null
}

async function tryGroq(userPrompt) {
  const key = process.env.GROQ_API_KEY
  if (!key) return null
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: BRAIN }, { role: 'user', content: userPrompt }],
          max_tokens: 8192,
          temperature: 0.8,
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (!text) continue
      return { parsed: extractJSON(text), model, tier: 'Groq' }
    } catch { continue }
  }
  return null
}

async function tryOpenRouter(userPrompt) {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) return null
  for (const model of OPENROUTER_MODELS) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://androit.ai',
          'X-Title': 'Androit',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: BRAIN }, { role: 'user', content: userPrompt }],
          max_tokens: 8192,
          temperature: 0.8,
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (!text) continue
      return { parsed: extractJSON(text), model, tier: 'OpenRouter' }
    } catch { continue }
  }
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { brief } = req.body
  if (!brief) return res.status(400).json({ error: 'No brief provided' })

  // Fetch brand website in parallel with nothing (fire and collect)
  const brandContext = await fetchBrandContext(brief.brandWebsite)

  const userPrompt = `Write a second-by-second shoot-ready script for this brief:

BRAND: ${brief.brandName}
PRODUCT/SERVICE: ${brief.productService}
TARGET AUDIENCE: ${brief.targetAudience || 'Not specified — infer from product and platform'}
PLATFORM: ${brief.platform}
DURATION: ${brief.duration}
OBJECTIVE: ${brief.objective}
BRAND EQUITY LEVEL: ${brief.brandEquity}
EXISTING DISTINCTIVE ASSETS: ${brief.distinctiveAssets || 'None specified — design new ones appropriate for this brand'}
KEY MESSAGE: ${brief.keyMessage || 'Not specified — derive from product and audience'}
MANDATORIES/CONSTRAINTS: ${brief.mandatories || 'None'}

${dialogueInstruction(brief.dialogueLevel || 'moderate')}

${formatBrandContext(brandContext)}

Apply every brain framework rigorously. Be specific, concrete, and shoot-ready in every scene. The "script" field for every scene must NEVER be null or empty — if there is no dialogue, describe the visual performance instead. Return only valid raw JSON — no markdown, no preamble.`

  try {
    const result =
      (await tryGemini(userPrompt)) ||
      (await tryGroq(userPrompt)) ||
      (await tryOpenRouter(userPrompt))

    if (!result) {
      return res.status(500).json({ error: 'All intelligence systems failed. Please try again.' })
    }

    // Never expose which model was used
    return res.status(200).json({ output: result.parsed })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown error' })
  }
}
