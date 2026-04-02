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
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: BRAIN },
            { role: 'user', content: userPrompt },
          ],
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
          'HTTP-Referer': 'https://script-brain.vercel.app',
          'X-Title': 'Script Brain',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: BRAIN },
            { role: 'user', content: userPrompt },
          ],
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

Apply every brain framework rigorously. Be specific, concrete, and shoot-ready in every scene. Return only valid raw JSON — no markdown, no preamble.`

  try {
    const result =
      (await tryGemini(userPrompt)) ||
      (await tryGroq(userPrompt)) ||
      (await tryOpenRouter(userPrompt))

    if (!result) {
      return res.status(500).json({ error: 'All AI providers failed. Please try again.' })
    }

    return res.status(200).json({ output: result.parsed, model: result.model, tier: result.tier })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown error' })
  }
}
