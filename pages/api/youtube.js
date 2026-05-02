// YouTube extraction + script reconstruction pipeline
// No API keys required for extraction — uses public YouTube page data + timedtext API

export const config = { maxDuration: 60 }

const GEMINI_MODELS = ['gemini-2.5-pro-preview-06-05','gemini-2.5-pro','gemini-2.0-flash-preview','gemini-2.5-flash','gemini-2.5-flash-lite']
const GROQ_MODELS   = ['llama-3.3-70b-versatile','llama-3.1-70b-versatile','mixtral-8x7b-32768','llama3-70b-8192']
const OR_MODELS     = ['meta-llama/llama-3.3-70b-instruct:free','mistralai/mixtral-8x7b-instruct:free','google/gemma-2-9b-it:free']

// ── 1. Extract video ID from any YouTube URL format ──────────────────
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

// ── 2. Fetch YouTube page and extract metadata + caption track ────────
async function fetchYouTubePage(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) throw new Error(`YouTube fetch failed: ${res.status}`)
  return res.text()
}

function extractMetadata(html) {
  let title = '', description = '', durationSecs = 0, captionTracks = []

  // OG tags as quick baseline
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)
  const ogDesc  = html.match(/<meta property="og:description" content="([^"]+)"/)
  if (ogTitle) title = ogTitle[1]
  if (ogDesc)  description = ogDesc[1]

  // Parse ytInitialPlayerResponse for richer data + captions
  const playerMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});\s*(?:var |<\/script>)/s)
    || html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\})\s*;/)

  if (playerMatch) {
    try {
      const player = JSON.parse(playerMatch[1])
      const vd = player?.videoDetails || {}
      if (vd.title)            title = vd.title
      if (vd.shortDescription) description = vd.shortDescription
      if (vd.lengthSeconds)    durationSecs = parseInt(vd.lengthSeconds, 10)

      const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks || []
      captionTracks = tracks.map(t => ({
        lang: t.languageCode,
        name: t.name?.simpleText || t.languageCode,
        baseUrl: t.baseUrl,
        isAuto: (t.kind === 'asr'),
      }))
    } catch {}
  }

  return { title, description, durationSecs, captionTracks }
}

// ── 3. Fetch and parse timed transcript ──────────────────────────────
async function fetchTranscript(captionTracks) {
  const preferred = captionTracks.find(t => t.lang === 'en' && !t.isAuto)
    || captionTracks.find(t => t.lang === 'en')
    || captionTracks.find(t => t.lang?.startsWith('en'))
    || captionTracks[0]

  if (!preferred?.baseUrl) return null

  // Try JSON3 format first
  try {
    const jsonUrl = preferred.baseUrl.includes('fmt=')
      ? preferred.baseUrl.replace(/&fmt=[^&]+/, '&fmt=json3')
      : preferred.baseUrl + '&fmt=json3'

    const res = await fetch(jsonUrl, { signal: AbortSignal.timeout(8000) })
    if (res.ok) {
      const data = await res.json()
      const events = data.events || []
      const lines = []

      for (const event of events) {
        if (!event.segs) continue
        const startSec = Math.round((event.tStartMs || 0) / 1000)
        const text = event.segs.map(s => s.utf8 || '').join('').replace(/\n/g, ' ').trim()
        if (text && text.trim()) lines.push({ t: startSec, text: text.trim() })
      }

      // Merge very short adjacent lines
      const merged = []
      for (const line of lines) {
        const last = merged[merged.length - 1]
        if (last && line.t - last.t < 2 && last.text.length < 120) {
          last.text += ' ' + line.text
        } else {
          merged.push({ ...line })
        }
      }
      if (merged.length > 0) return merged
    }
  } catch {}

  // XML fallback
  try {
    const res = await fetch(preferred.baseUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const xml = await res.text()
    const lines = []
    const regex = /<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g
    let m
    while ((m = regex.exec(xml)) !== null) {
      const t = Math.round(parseFloat(m[1]))
      const text = m[2]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
        .trim()
      if (text) lines.push({ t, text })
    }
    return lines.length > 0 ? lines : null
  } catch {
    return null
  }
}

// ── 4. AI: reconstruct second-by-second scene script ─────────────────
const RECONSTRUCT_SYSTEM = `You are a specialist in reconstructing advertising scripts from YouTube video transcripts and metadata.

Given a timed transcript (with [Xs] second markers), video title, and description, reconstruct a detailed second-by-second scene-by-scene script suitable for behavioral science testing.

RULES:
- Use transcript timestamps as anchor points for scene timing
- Infer visual scenes intelligently from audio content, pacing, and product category context
- Fill gaps between dialogue with plausible visual descriptions (based on ad conventions for this category)
- Never invent dialogue that wasn't in the transcript — only infer visuals
- Each scene must have a timecode, visual description, and any dialogue present
- Be specific and concrete — name visual elements, describe expressions, camera angles

OUTPUT FORMAT — plain text only, no JSON, no markdown headers:

Scene 1 (0s–Xs): [Visual description]. Dialogue: "[exact transcript words]"
Scene 2 (Xs–Ys): [Visual description]. No dialogue — [what is visually happening based on pacing/context]
...continue until end of video...

On the final line, write exactly:
BRAND: [inferred brand name] | CATEGORY: [product category] | DURATION: [total duration in format like "30 seconds"]`

async function reconstructWithAI(prompt) {
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: RECONSTRUCT_SYSTEM }] },
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.5, maxOutputTokens: 4096 },
            }),
            signal: AbortSignal.timeout(30000),
          }
        )
        if (!res.ok) continue
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return text
      } catch { continue }
    }
  }

  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    for (const model of GROQ_MODELS) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: RECONSTRUCT_SYSTEM }, { role: 'user', content: prompt }],
            max_tokens: 4096, temperature: 0.5,
          }),
          signal: AbortSignal.timeout(20000),
        })
        if (!res.ok) continue
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content
        if (text) return text
      } catch { continue }
    }
  }

  const orKey = process.env.OPENROUTER_API_KEY
  if (orKey) {
    for (const model of OR_MODELS) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${orKey}`, 'Content-Type': 'application/json', 'X-Title': 'Adroit' },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: RECONSTRUCT_SYSTEM }, { role: 'user', content: prompt }],
            max_tokens: 4096, temperature: 0.5,
          }),
          signal: AbortSignal.timeout(20000),
        })
        if (!res.ok) continue
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content
        if (text) return text
      } catch { continue }
    }
  }

  return null
}

// ── MAIN HANDLER ──────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { url } = req.body || {}
    if (!url) return res.status(400).json({ error: 'No URL provided' })

    const videoId = extractVideoId(url.trim())
    if (!videoId) {
      return res.status(400).json({ error: 'Could not find a YouTube video ID in this URL. Supported: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...' })
    }

    // Fetch page
    let html
    try {
      html = await fetchYouTubePage(videoId)
    } catch (e) {
      return res.status(500).json({ error: `Could not reach YouTube: ${e.message}` })
    }

    // Extract metadata
    const meta = extractMetadata(html)
    if (!meta.title) {
      return res.status(500).json({ error: 'Could not read video details. The video may be private, age-restricted, or removed.' })
    }

    // Fetch transcript
    let transcript = null
    if (meta.captionTracks.length > 0) {
      transcript = await fetchTranscript(meta.captionTracks)
    }

    const hasTranscript = !!(transcript && transcript.length > 0)
    const transcriptText = hasTranscript
      ? transcript.map(l => `[${l.t}s] ${l.text}`).join('\n')
      : '(No captions available — reconstructing from title and description only)'

    // Build reconstruction prompt
    const prompt = `VIDEO TITLE: ${meta.title}
DESCRIPTION: ${(meta.description || '').slice(0, 500)}
DURATION: ${meta.durationSecs > 0 ? meta.durationSecs + 's' : 'unknown'}
VIDEO URL: https://youtube.com/watch?v=${videoId}

TIMED TRANSCRIPT:
${transcriptText}

Reconstruct the full second-by-second scene-by-scene ad script from this information.`

    const reconstructed = await reconstructWithAI(prompt)

    if (!reconstructed) {
      return res.status(500).json({ error: 'Script reconstruction failed. All AI providers are currently unavailable — please try again shortly.' })
    }

    // Parse brand/category hint
    let suggestedBrand = '', suggestedCategory = '', suggestedDuration = ''
    const metaLine = reconstructed.match(/BRAND:\s*([^|]+)\s*\|\s*CATEGORY:\s*([^|]+)\s*\|\s*DURATION:\s*([^\n]+)/i)
    if (metaLine) {
      suggestedBrand    = metaLine[1].trim()
      suggestedCategory = metaLine[2].trim()
      suggestedDuration = metaLine[3].trim()
    }

    // Clean the reconstructed script (remove the meta line from the script text)
    const cleanScript = reconstructed.replace(/BRAND:.*$/im, '').trim()

    return res.status(200).json({
      success: true,
      videoId,
      title: meta.title,
      description: (meta.description || '').slice(0, 300),
      durationSecs: meta.durationSecs,
      hasTranscript,
      captionLanguages: meta.captionTracks.map(t => `${t.lang}${t.isAuto ? ' (auto)' : ''}`),
      reconstructedScript: cleanScript,
      suggestedBrand,
      suggestedCategory,
      suggestedDuration,
    })

  } catch (err) {
    console.error('YouTube route error:', err)
    return res.status(500).json({ error: err.message || 'Unexpected server error' })
  }
}
