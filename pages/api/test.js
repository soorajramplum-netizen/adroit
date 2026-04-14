import { TEST_BRAIN } from '../../lib/test-brain'

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
  const m = text.match(/\{[\s\S]*\}/)
  if (m) { try { return JSON.parse(m[0]) } catch {} }
  throw new Error('Could not parse JSON from model response')
}

async function callGemini(prompt) {
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
            system_instruction: { parts: [{ text: TEST_BRAIN }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 8192 },
          }),
          signal: AbortSignal.timeout(50000),
        }
      )
      if (!res.ok) continue
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) continue
      return extractJSON(text)
    } catch { continue }
  }
  return null
}

async function callGroq(prompt) {
  const key = process.env.GROQ_API_KEY
  if (!key) return null
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: TEST_BRAIN }, { role: 'user', content: prompt }],
          max_tokens: 8192, temperature: 0.6,
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (!text) continue
      return extractJSON(text)
    } catch { continue }
  }
  return null
}

async function callOpenRouter(prompt) {
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
          messages: [{ role: 'system', content: TEST_BRAIN }, { role: 'user', content: prompt }],
          max_tokens: 8192, temperature: 0.6,
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (!text) continue
      return extractJSON(text)
    } catch { continue }
  }
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { submission } = req.body
  if (!submission) return res.status(400).json({ error: 'No submission provided' })

  const prompt = `Evaluate this ad script submission:

BRAND: ${submission.brand}
PRODUCT / CATEGORY: ${submission.category}
PLATFORM: ${submission.platform}
CAMPAIGN OBJECTIVE: ${submission.objective}
TARGET AUDIENCE: ${submission.audience || 'Not specified — infer from brand and category'}
INSIGHT PROVIDED BY USER: ${submission.insightProvided ? 'YES' : 'NO — generate the correct category insight and evaluate the script against it'}
${submission.insightProvided ? `USER'S INSIGHT: ${submission.insight}` : ''}

SCRIPT TO EVALUATE:
${submission.script}

Run the full evaluation. Be precise, specific, and genuinely useful. Never soften scores out of politeness — harsh honest feedback is more valuable than polite vagueness. Return only valid raw JSON.`

  try {
    const result =
      (await callGemini(prompt)) ||
      (await callGroq(prompt)) ||
      (await callOpenRouter(prompt))

    if (!result) return res.status(500).json({ error: 'All intelligence systems failed. Please try again.' })
    return res.status(200).json({ result })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown error' })
  }
}
