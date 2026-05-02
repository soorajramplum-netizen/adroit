import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const LOADING_STEPS = [
  'Mapping category psychology',
  'Identifying consumer pain points',
  'Detecting category clichés',
  'Finding white space',
  'Reading brand assets',
  'Evaluating emotional arc',
  'Scoring platform alignment',
  'Running bias audit',
  'Calculating insight coherence',
  'Compiling verdict',
]

const WRITE_STEPS = [
  'Absorbing evaluation findings',
  'Designing corrected emotional arc',
  'Placing distinctive assets',
  'Writing scenes second by second',
  'Applying psycho-logic principles',
  'Finalising Adroit script',
]

const TIER_CONFIG = {
  'Breakthrough': { color: '#16A34A', bg: '#DCFCE7' },
  'Strong':       { color: '#2563EB', bg: '#DBEAFE' },
  'Solid':        { color: '#D97706', bg: '#FEF3C7' },
  'Needs work':   { color: '#DC2626', bg: '#FEE2E2' },
  'Rethink':      { color: '#7C3AED', bg: '#EDE9FE' },
}

const GOAL_STYLES = {
  'HOOK':           { bg: '#DBEAFE', color: '#1D4ED8' },
  'BRAND BURN':     { bg: '#FEF3C7', color: '#92400E' },
  'EMOTION BUILD':  { bg: '#DBEAFE', color: '#1D4ED8' },
  'TENSION':        { bg: '#FEE2E2', color: '#991B1B' },
  'PEAK':           { bg: '#DC2626', color: '#FFFFFF' },
  'RESOLUTION':     { bg: '#DCFCE7', color: '#14532D' },
  'CTA':            { bg: '#F5F5F2', color: '#5A5A55' },
  'CLOSING BRAND':  { bg: '#FEF3C7', color: '#92400E' },
}

function goalStyle(goal = '') {
  for (const [key, val] of Object.entries(GOAL_STYLES)) {
    if (goal.toUpperCase().includes(key)) return val
  }
  return { bg: '#F5F5F2', color: '#5A5A55' }
}

// truncate to ~2 lines worth (~160 chars)
function short(text, max = 160) {
  if (!text) return '—'
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

const S = {
  panelField: { border: '1px solid #0A0A0A', padding: '16px 20px', background: '#fff' },
  panelNoTop: { border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px', background: '#fff' },
  label: { display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 },
  bareInput: { border: 'none', padding: 0, fontSize: 14, fontWeight: 500, background: 'transparent', outline: 'none', width: '100%', color: '#0A0A0A', fontFamily: 'var(--font-body)' },
  sectionLabel: { fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 },
}

function Header({ activeTab }) {
  const router = useRouter()
  return (
    <header style={{ borderBottom: '1px solid #0A0A0A', background: '#0A0A0A' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '0.1em', color: '#F59E0B', textTransform: 'uppercase' }}>Adroit</span>
          <span style={{ fontSize: 9, color: '#3A3A35', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Proprietary Script Intelligence</span>
        </div>
        <nav style={{ display: 'flex', gap: 2 }}>
          {[{ label: 'Write', href: '/' }, { label: 'Test', href: '/test' }].map(t => {
            const active = activeTab === t.label
            return (
              <button key={t.label} onClick={() => router.push(t.href)} style={{
                padding: '6px 18px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer',
                background: active ? '#F59E0B' : 'transparent',
                color: active ? '#0A0A0A' : '#5A5A55',
                border: 'none', borderRadius: 2, transition: 'all 0.15s',
              }}>{t.label}</button>
            )
          })}
        </nav>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, background: i === 0 ? '#F59E0B' : '#2A2A25', borderRadius: 1 }} />)}
        </div>
      </div>
    </header>
  )
}

function ScoreGauge({ score, max, label, accent }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B9B95' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#0A0A0A', lineHeight: 1 }}>
          {score}<span style={{ fontSize: 12, fontWeight: 400, color: '#9B9B95' }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 2, background: '#E8E8E4', borderRadius: 1 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: 1 }} />
      </div>
    </div>
  )
}

function SceneScoreBar({ score, max = 10 }) {
  const pct = (score / max) * 100
  const color = pct >= 70 ? '#16A34A' : pct >= 45 ? '#D97706' : '#DC2626'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 2, background: '#E8E8E4', borderRadius: 1 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 1 }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{score}/{max}</span>
    </div>
  )
}

function TestForm({ sub, setSub, onSubmit, error }) {
  const [insightProvided, setInsightProvided] = useState(false)
  const [inputMode, setInputMode] = useState('manual')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeLoading, setYoutubeLoading] = useState(false)
  const [youtubeError, setYoutubeError] = useState(null)
  const [youtubeMeta, setYoutubeMeta] = useState(null)

  const handleExtractYoutube = async () => {
    setYoutubeLoading(true)
    setYoutubeError(null)
    setYoutubeMeta(null)
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Extraction failed')
      setYoutubeMeta(data)
      setSub(s => ({
        ...s,
        script:   data.reconstructedScript || '',
        brand:    data.suggestedBrand    || s.brand,
        category: data.suggestedCategory || s.category,
      }))
    } catch (e) {
      setYoutubeError(e.message)
    } finally {
      setYoutubeLoading(false)
    }
  }
  const canSubmit = sub.brand && sub.category && sub.platform && sub.objective && sub.script?.trim().length > 40

  function set(k, v) { setSub(s => ({ ...s, [k]: v })) }
  useEffect(() => { setSub(s => ({ ...s, insightProvided })) }, [insightProvided])

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px 80px' }}>
      <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid #0A0A0A' }}>
        <div style={{ ...S.sectionLabel, marginBottom: 12 }}>Ad Testing Engine</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 68, fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 0.88, color: '#0A0A0A', marginBottom: 20 }}>
          Test<br/>Your<br/>Script
        </h1>
        <p style={{ fontSize: 13, color: '#5A5A55', maxWidth: 460, lineHeight: 1.75 }}>
          Two-layer evaluation — consumer insight quality and behavioral science execution. Scored to 100. Adroit then rewrites the script from scratch using the findings.
        </p>
      </div>

      <div style={{ ...S.sectionLabel, marginBottom: 20 }}>The submission</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        {[
          { key: 'brand',    label: 'Brand name',         placeholder: 'e.g. Meera' },
          { key: 'category', label: 'Product / category', placeholder: 'e.g. Hairfall shampoo, Running shoes' },
        ].map(f => (
          <div key={f.key} style={S.panelField}>
            <label style={S.label}>{f.label}</label>
            <input value={sub[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={S.bareInput} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        {[
          { key: 'platform',  label: 'Platform',           placeholder: 'e.g. Instagram Reels, TV 30s' },
          { key: 'objective', label: 'Campaign objective', placeholder: 'e.g. Brand awareness, trial' },
        ].map(f => (
          <div key={f.key} style={{ ...S.panelField, borderTop: 'none' }}>
            <label style={S.label}>{f.label} <span style={{ color: '#DC2626', fontSize: 9 }}>required</span></label>
            <input value={sub[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={S.bareInput} />
          </div>
        ))}
      </div>

      <div style={S.panelNoTop}>
        <label style={S.label}>Target audience <span style={{ color: '#9B9B95', fontSize: 9 }}>optional</span></label>
        <input value={sub.audience || ''} onChange={e => set('audience', e.target.value)} placeholder="e.g. Women 25–40, urban, experiencing hairfall" style={S.bareInput} />
      </div>

      {/* DBA field — NEW */}
      <div style={S.panelNoTop}>
        <label style={S.label}>
          Distinctive brand assets <span style={{ color: '#9B9B95', fontSize: 9 }}>optional — used to write the Adroit script after evaluation</span>
        </label>
        <input value={sub.distinctiveAssets || ''} onChange={e => set('distinctiveAssets', e.target.value)}
          placeholder="e.g. brand jingle, mascot name, signature color, sonic logo, tagline" style={S.bareInput} />
      </div>

      {/* Insight toggle */}
      <div style={S.panelNoTop}>
        <div style={{ ...S.label, marginBottom: 14 }}>Do you have an insight this script is based on?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { v: false, label: 'No — generate & test against it', desc: 'Adroit will derive the right insight for this category and evaluate your script against it' },
            { v: true,  label: 'Yes — I have one',                desc: "Paste your insight below and we'll test both its strength and how well your script expresses it" },
          ].map(opt => (
            <button key={String(opt.v)} onClick={() => setInsightProvided(opt.v)} style={{
              flex: 1, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
              background: insightProvided === opt.v ? '#0A0A0A' : 'transparent',
              border: insightProvided === opt.v ? '1px solid #0A0A0A' : '1px solid #E8E8E4',
              borderRadius: 2, transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: insightProvided === opt.v ? '#F59E0B' : '#0A0A0A', marginBottom: 4 }}>{opt.label}</div>
              <div style={{ fontSize: 10, color: insightProvided === opt.v ? '#6A6A60' : '#9B9B95', lineHeight: 1.5 }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {insightProvided && (
        <div style={S.panelNoTop}>
          <label style={S.label}>Your insight</label>
          <textarea value={sub.insight || ''} onChange={e => set('insight', e.target.value)}
            placeholder="e.g. Women experiencing hairfall aren't looking for beautiful hair — they're looking for someone who acknowledges the specific grief of watching their hair change..."
            rows={4} style={{ ...S.bareInput, fontSize: 13, fontWeight: 400, resize: 'vertical', lineHeight: 1.7 }} />
        </div>
      )}

      {/* Input mode */}
      <div style={S.panelNoTop}>
        <div style={{ ...S.label, marginBottom: 14 }}>How would you like to submit your ad?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { v: 'manual',  label: 'Paste script',  desc: 'Type or paste your script in any format — scene notes, bullets, or full description' },
            { v: 'youtube', label: 'YouTube link',  desc: 'Paste a YouTube URL — Adroit reads the transcript and reconstructs the script automatically' },
          ].map(opt => {
            const active = inputMode === opt.v
            return (
              <button key={opt.v} onClick={() => setInputMode(opt.v)} style={{
                flex: 1, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                background: active ? '#0A0A0A' : 'transparent',
                border: active ? '1px solid #0A0A0A' : '1px solid #E8E8E4',
                borderRadius: 2, transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#F59E0B' : '#0A0A0A', marginBottom: 4 }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: active ? '#6A6A60' : '#9B9B95', lineHeight: 1.5 }}>{opt.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* YouTube URL field */}
      {inputMode === 'youtube' && (
        <div style={S.panelNoTop}>
          <label style={S.label}>YouTube URL <span style={{ color: '#DC2626', fontSize: 9 }}>required</span></label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or youtu.be/..."
              style={{ ...S.bareInput, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && youtubeUrl.trim() && !youtubeLoading && handleExtractYoutube()}
            />
            <button onClick={handleExtractYoutube} disabled={!youtubeUrl.trim() || youtubeLoading} style={{
              padding: '9px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: youtubeUrl.trim() && !youtubeLoading ? 'pointer' : 'not-allowed',
              background: youtubeUrl.trim() && !youtubeLoading ? '#0A0A0A' : '#E8E8E4',
              color: youtubeUrl.trim() && !youtubeLoading ? '#F59E0B' : '#9B9B95',
              border: 'none', borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {youtubeLoading ? 'Extracting…' : 'Extract →'}
            </button>
          </div>

          {youtubeError && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: '#FEE2E2', borderRadius: 2, fontSize: 11, color: '#991B1B' }}>{youtubeError}</div>
          )}

          {youtubeMeta && !youtubeError && (
            <div style={{ marginTop: 12, padding: '12px 16px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A', lineHeight: 1.4, flex: 1 }}>{youtubeMeta.title}</div>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 2, flexShrink: 0,
                  background: youtubeMeta.hasTranscript ? '#DCFCE7' : '#FEF3C7',
                  color: youtubeMeta.hasTranscript ? '#14532D' : '#92400E',
                }}>
                  {youtubeMeta.hasTranscript ? '✓ Transcript found' : 'No captions — inferred from metadata'}
                </span>
              </div>
              {youtubeMeta.durationSecs > 0 && (
                <div style={{ fontSize: 10, color: '#5A5A55', marginTop: 4 }}>
                  {youtubeMeta.durationSecs}s · {youtubeMeta.captionLanguages?.length > 0 ? youtubeMeta.captionLanguages.join(', ') : 'no captions'}
                </div>
              )}
              <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 600, marginTop: 8 }}>✓ Script reconstructed — review below and edit if needed</div>
            </div>
          )}
        </div>
      )}

      {/* Script textarea */}
      <div style={S.panelNoTop}>
        <label style={S.label}>
          {inputMode === 'youtube' ? 'Reconstructed script' : 'Your script'}
          {inputMode !== 'youtube' && <span style={{ color: '#DC2626', fontSize: 9 }}> required</span>}
          <span style={{ color: '#9B9B95', fontSize: 9 }}>
            {inputMode === 'youtube' ? ' — auto-generated, edit freely before testing' : ' — any format: scene notes, full script, bullets'}
          </span>
        </label>
        <textarea value={sub.script || ''} onChange={e => set('script', e.target.value)}
          placeholder={inputMode === 'youtube'
            ? 'Extract a YouTube video above to auto-populate this field…'
            : 'Scene 1 (0s–5s): Woman wakes up, walks to bathroom mirror...\nScene 2 (5s–12s): Close-up of hairbrush — more hair than usual...\nScene 3 (12s–20s): Product introduction...'
          }
          rows={12} style={{ ...S.bareInput, fontSize: 12, fontWeight: 400, resize: 'vertical', lineHeight: 1.75 }} />
      </div>

      <button onClick={onSubmit} disabled={!canSubmit} style={{
        display: 'block', width: '100%', marginTop: 1, padding: '18px 24px',
        fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
        cursor: canSubmit ? 'pointer' : 'not-allowed',
        background: canSubmit ? '#0A0A0A' : '#E8E8E4',
        color: canSubmit ? '#F59E0B' : '#9B9B95',
        border: 'none', transition: 'all 0.15s',
      }}>Run Evaluation →</button>

      {error && <div style={{ marginTop: 16, padding: '12px 16px', background: '#FEE2E2', border: '1px solid #DC2626', fontSize: 12, color: '#991B1B' }}>{error}</div>}
    </main>
  )
}

function LoadingScreen({ step, steps, label }) {
  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: '70vh', justifyContent: 'center' }}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, color: '#0A0A0A', opacity: 0.06, userSelect: 'none', marginBottom: 52 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 32 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: 26, height: 3, background: i < step ? '#F59E0B' : i === step ? '#0A0A0A' : '#E8E8E4', transition: 'background 0.4s ease' }} />
        ))}
      </div>
      <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 6 }}>Step {step + 1} of {steps.length}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', lineHeight: 1.3 }}>
        {steps[Math.min(step, steps.length - 1)]}
        <span style={{ animation: 'blink 1.1s step-end infinite', color: '#F59E0B' }}>_</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 11, color: '#9B9B95' }}>
        {Math.round((step / steps.length) * 100)}% — Adroit's intelligence is working
      </div>
    </main>
  )
}

// ── ADROIT SCRIPT OUTPUT (embedded in results) ─────────────────────────
function AdroitScriptPanel({ script }) {
  const ov = script?.overview || {}
  const scenes = script?.scenes || []

  const COLS = [
    { label: '① Time',              w: 90  },
    { label: '② Scene',             w: 230 },
    { label: '③ Shot type',         w: 140 },
    { label: '④ Script & dialogue', w: 230 },
    { label: '⑤ Music & SFX',       w: 170 },
    { label: '⑥ Scene goal',        w: 120 },
  ]

  return (
    <div>
      {/* Overview strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginBottom: 1 }}>
        {[
          { label: 'Creative mode', val: ov.creative_mode },
          { label: 'Show / Sell',   val: ov.showmanship_salesmanship_ratio },
          { label: 'Peak at',       val: ov.peak_moment_timing },
          { label: 'Dominant emotion', val: ov.dominant_emotion },
        ].map(c => (
          <div key={c.label} style={{ border: '1px solid #0A0A0A', padding: '12px 16px' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A' }}>{c.val || '—'}</div>
          </div>
        ))}
      </div>

      {/* Emotional arc */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', borderLeft: '4px solid #F59E0B', padding: '16px 20px', marginBottom: 1, background: '#FFFBEB' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>Emotional arc</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>{ov.emotional_arc}</div>
      </div>

      {/* Director notes */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px', marginBottom: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 6 }}>Director's notes</div>
        <div style={{ fontSize: 12, color: '#5A5A55', lineHeight: 1.7 }}>{ov.director_notes}</div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: COLS.reduce((s, c) => s + c.w, 0), borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#F5F5F2' }}>
                {COLS.map(c => (
                  <th key={c.label} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B9B95', borderBottom: '1px solid #0A0A0A', fontWeight: 600, whiteSpace: 'nowrap', minWidth: c.w }}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenes.map((sc, i) => {
                const gs = goalStyle(sc.scene_goal)
                const noDialogue = !sc.script || sc.script === 'null' || sc.script.toLowerCase().includes('no dialogue')
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8', borderBottom: '1px solid #F0F0EC' }}>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ display: 'inline-block', background: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 10, padding: '3px 10px', borderRadius: 2 }}>{sc.timecode}</span>
                    </td>
                    <td style={{ padding: '13px 14px', maxWidth: 230, fontSize: 12, color: '#0A0A0A', lineHeight: 1.6 }}>{sc.scene}</td>
                    <td style={{ padding: '13px 14px', maxWidth: 140, fontSize: 11, color: '#5A5A55', lineHeight: 1.5 }}>{sc.shot_type}</td>
                    <td style={{ padding: '13px 14px', maxWidth: 230 }}>
                      <div style={{ fontSize: 12, color: noDialogue ? '#9B9B95' : '#0A0A0A', fontStyle: noDialogue ? 'italic' : 'normal', lineHeight: 1.6 }}>{sc.script || 'Visual storytelling — no dialogue'}</div>
                      {sc.on_screen_text && sc.on_screen_text !== 'null' && (
                        <div style={{ marginTop: 6, display: 'inline-block', background: '#FEF3C7', color: '#92400E', fontSize: 9, padding: '2px 8px', borderRadius: 2, fontWeight: 700 }}>TEXT: {sc.on_screen_text}</div>
                      )}
                    </td>
                    <td style={{ padding: '13px 14px', maxWidth: 170, fontSize: 11, color: '#5A5A55', lineHeight: 1.5 }}>{sc.music_sfx}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ display: 'inline-block', background: gs.bg, color: gs.color, fontWeight: 700, fontSize: 9, padding: '4px 10px', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>{sc.scene_goal}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DBAs */}
      {ov.distinctive_assets_deployed?.length > 0 && (
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 10 }}>Distinctive assets deployed</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ov.distinctive_assets_deployed.map((a, i) => (
              <span key={i} style={{ background: '#0A0A0A', color: '#F59E0B', fontWeight: 700, fontSize: 9, padding: '5px 14px', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>{a}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── RESULTS ───────────────────────────────────────────────────────────
function TestResults({ result, adroitScript, onReset }) {
  const [showRewrite, setShowRewrite] = useState(false)

  const r = result
  const scores = r?.scores || {}
  const ins = scores?.insight || {}
  const exc = scores?.execution || {}
  const verdict = r?.verdict || {}
  const tier = TIER_CONFIG[verdict.tier] || TIER_CONFIG['Solid']
  const ci = r?.category_insight || {}
  const scenes = r?.scene_scores || []
  const fixes = r?.top_fixes || []
  const rewrite = r?.the_one_rewrite || {}
  const total = scores?.total || 0

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 80px' }}>
      <button onClick={onReset} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9B9B95', cursor: 'pointer', background: 'none', border: 'none', padding: 0, marginBottom: 32 }}>
        ← New evaluation
      </button>

      {/* Title + score */}
      <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #0A0A0A', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>Evaluation results · {r?.meta?.brand}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 0.95, color: '#0A0A0A' }}>
            {r?.meta?.category}
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 900, lineHeight: 1, color: '#0A0A0A' }}>{total}</div>
          <div style={{ fontSize: 9, color: '#9B9B95', letterSpacing: '0.1em' }}>OUT OF 100</div>
        </div>
      </div>

      {/* Verdict banner */}
      <div style={{ border: `1px solid ${tier.color}`, borderLeft: `4px solid ${tier.color}`, padding: '20px 24px', background: tier.bg, marginBottom: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tier.color }}>{verdict.tier}</span>
          <span style={{ fontSize: 9, color: tier.color, opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r?.meta?.platform} · {r?.meta?.objective}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', marginBottom: 6 }}>{verdict.headline}</div>
        <div style={{ fontSize: 12, color: '#5A5A55', lineHeight: 1.7 }}>{short(verdict.summary, 200)}</div>
      </div>

      {/* Score gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 16 }}>Insight score</div>
          <ScoreGauge score={ins.subtotal || 0} max={50} label="Total insight" accent="#F59E0B" />
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ScoreGauge score={ins.consumer_truth_accuracy?.score || 0} max={20} label="Consumer truth accuracy" accent="#F59E0B" />
            <ScoreGauge score={ins.insight_freshness?.score || 0} max={15} label="Insight freshness" accent="#F59E0B" />
            <ScoreGauge score={ins.insight_execution_coherence?.score || 0} max={15} label="Insight-execution coherence" accent="#F59E0B" />
          </div>
        </div>
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', borderLeft: 'none', padding: '20px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 16 }}>Execution score</div>
          <ScoreGauge score={exc.subtotal || 0} max={50} label="Total execution" accent="#2563EB" />
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ScoreGauge score={exc.dba_architecture?.score || 0} max={10} label="DBA architecture" accent="#2563EB" />
            <ScoreGauge score={exc.emotional_arc?.score || 0} max={10} label="Emotional arc" accent="#2563EB" />
            <ScoreGauge score={exc.platform_alignment?.score || 0} max={10} label="Platform alignment" accent="#2563EB" />
            <ScoreGauge score={exc.bias_deployment?.score || 0} max={10} label="Bias deployment" accent="#2563EB" />
            <ScoreGauge score={exc.three_f_balance?.score || 0} max={10} label="3F balance" accent="#2563EB" />
          </div>
        </div>
      </div>

      {/* Score rationale — 2 lines max each */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px', marginBottom: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 16 }}>Score rationale</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Consumer truth accuracy',     data: ins.consumer_truth_accuracy,     accent: '#F59E0B' },
            { label: 'Insight freshness',           data: ins.insight_freshness,           accent: '#F59E0B' },
            { label: 'Insight-execution coherence', data: ins.insight_execution_coherence, accent: '#F59E0B' },
            { label: 'DBA architecture',            data: exc.dba_architecture,            accent: '#2563EB' },
            { label: 'Emotional arc',               data: exc.emotional_arc,               accent: '#2563EB' },
            { label: 'Platform alignment',          data: exc.platform_alignment,          accent: '#2563EB' },
            { label: 'Bias deployment',             data: exc.bias_deployment,             accent: '#2563EB' },
            { label: '3F balance',                  data: exc.three_f_balance,             accent: '#2563EB' },
          ].filter(x => x.data).map(({ label, data, accent }) => (
            <div key={label} style={{ paddingLeft: 12, borderLeft: `2px solid ${accent}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0A0A0A', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {data.rationale}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category insight panel */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', borderLeft: '4px solid #F59E0B', padding: '20px', marginBottom: 1, background: '#FFFBEB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#92400E' }}>Category insight analysis</div>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 2, letterSpacing: '0.04em',
            background: ci.insight_source === 'provided by user' ? '#DCFCE7' : '#FEF3C7',
            color: ci.insight_source === 'provided by user' ? '#14532D' : '#92400E',
          }}>
            {ci.insight_source === 'provided by user' ? 'User-provided insight' : 'Generated by Adroit'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>Primary pain</div>
            <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{short(ci.primary_pain)}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>Psychological pain — the real one</div>
            <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{short(ci.psychological_pain)}</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>Insight used to evaluate</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', lineHeight: 1.7, fontStyle: 'italic' }}>"{short(ci.insight_used, 220)}"</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 8 }}>Category clichés detected</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(ci.category_cliches || []).map((c, i) => (
                <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 2 }}>{c}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>White space available</div>
            <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{short(ci.white_space)}</div>
          </div>
        </div>
      </div>

      {/* Scene table */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', overflow: 'hidden', marginBottom: 1 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #0A0A0A', background: '#0A0A0A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F59E0B' }}>Scene-by-scene evaluation</div>
            <div style={{ fontSize: 9, color: '#5A5A55', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Consumer truth tapped per scene</div>
          </div>
          <div style={{ fontSize: 10, color: '#5A5A55' }}>{scenes.length} scenes</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Scene', 'Score', 'Consumer truth tapped', "What's working", 'Fix'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B9B95', borderBottom: '1px solid #0A0A0A', background: '#F5F5F2', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenes.map((sc, i) => {
              const hasTruth = sc.consumer_truth_tapped && !sc.consumer_truth_tapped.toLowerCase().includes('none')
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8', borderBottom: '1px solid #F0F0EC' }}>
                  <td style={{ padding: '12px 16px', maxWidth: 150 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#92400E', background: '#FEF3C7', display: 'inline-block', padding: '2px 8px', borderRadius: 2, marginBottom: 4 }}>{sc.timecode}</div>
                    <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.5 }}>{short(sc.scene_summary, 80)}</div>
                  </td>
                  <td style={{ padding: '12px 16px', minWidth: 110 }}><SceneScoreBar score={sc.execution_score || 0} max={sc.execution_score_max || 10} /></td>
                  <td style={{ padding: '12px 16px', maxWidth: 180 }}>
                    {hasTruth
                      ? <span style={{ fontSize: 11, color: '#14532D', background: '#DCFCE7', padding: '3px 8px', borderRadius: 2, display: 'inline-block', lineHeight: 1.5 }}>{short(sc.consumer_truth_tapped, 100)}</span>
                      : <span style={{ fontSize: 10, color: '#9B9B95', fontStyle: 'italic' }}>None — pure brand delivery</span>}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: 180, fontSize: 11, color: '#0A0A0A', lineHeight: 1.6 }}>{short(sc.whats_working, 100)}</td>
                  <td style={{ padding: '12px 16px', maxWidth: 180, fontSize: 11, color: '#DC2626', lineHeight: 1.6 }}>{short(sc.fix, 100)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Top 3 fixes */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px', marginBottom: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 14 }}>Top 3 highest-impact fixes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fixes.map((fix, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', background: '#F9F9F7', border: '1px solid #E8E8E4', borderRadius: 2 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#E8E8E4', lineHeight: 1, minWidth: 28 }}>{fix.priority}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7, marginBottom: 8 }}>{short(fix.fix, 180)}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 2, background: fix.impact === 'High' ? '#FEE2E2' : '#FEF3C7', color: fix.impact === 'High' ? '#991B1B' : '#92400E' }}>Impact: {fix.impact}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 2, background: fix.effort === 'Low' ? '#DCFCE7' : fix.effort === 'Medium' ? '#FEF3C7' : '#FEE2E2', color: fix.effort === 'Low' ? '#14532D' : fix.effort === 'Medium' ? '#92400E' : '#991B1B' }}>Effort: {fix.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The one rewrite (collapsible) */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', marginBottom: 1 }}>
        <button onClick={() => setShowRewrite(r => !r)} style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', cursor: 'pointer', border: 'none',
          background: showRewrite ? '#F9F8F5' : '#fff', fontFamily: 'var(--font-body)',
          fontWeight: 600, fontSize: 12, letterSpacing: '0.04em', color: '#0A0A0A', textAlign: 'left',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#DC2626', fontSize: 13 }}>◆</span>
            The one rewrite — {rewrite.scene_reference}
          </span>
          <span style={{ fontSize: 16, color: '#9B9B95', fontWeight: 300, display: 'inline-block', transform: showRewrite ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</span>
        </button>
        {showRewrite && (
          <div style={{ borderTop: '1px solid #0A0A0A' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8E8E4', background: '#FFFBEB' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>Why this scene</div>
              <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{short(rewrite.why_this_scene, 200)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '18px 20px', borderRight: '1px solid #E8E8E4' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 10 }}>Original</div>
                <div style={{ fontSize: 12, color: '#5A5A55', lineHeight: 1.75, fontStyle: 'italic', background: '#FEF2F2', padding: '12px', borderRadius: 2 }}>{rewrite.original}</div>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#16A34A', marginBottom: 10 }}>Rewritten</div>
                <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75, background: '#F0FDF4', padding: '12px', borderRadius: 2 }}>{rewrite.rewritten_scene}</div>
                {rewrite.rewritten_script && <div style={{ marginTop: 10, fontSize: 11, color: '#0A0A0A', lineHeight: 1.65 }}>{rewrite.rewritten_script}</div>}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E8E8E4', background: '#F9F9F7' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>What changed and why</div>
              <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75 }}>{short(rewrite.what_changed, 300)}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── HOW ADROIT WOULD WRITE THIS ── */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', background: '#0A0A0A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F59E0B' }}>
              How Adroit would write this
            </div>
            <div style={{ fontSize: 9, color: '#5A5A55', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>
              Script rebuilt from scratch using evaluation findings
            </div>
          </div>
          {adroitScript?.overview?.script_title && (
            <div style={{ fontSize: 11, color: '#9B9B95', fontStyle: 'italic' }}>"{adroitScript.overview.script_title}"</div>
          )}
        </div>
        {adroitScript
          ? <AdroitScriptPanel script={adroitScript} />
          : (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#9B9B95' }}>Generating Adroit's version of this script…</div>
            </div>
          )
        }
      </div>
    </main>
  )
}

// ── ROOT ───────────────────────────────────────────────────────────────
export default function TestPage() {
  const [view, setView] = useState('form')
  const [loadingStep, setLoadingStep] = useState(0)
  const [writeStep, setWriteStep] = useState(0)
  const [sub, setSub] = useState({
    brand: '', category: '', platform: '', objective: '',
    audience: '', distinctiveAssets: '', insightProvided: false, insight: '', script: '',
  })
  const [result, setResult] = useState(null)
  const [adroitScript, setAdroitScript] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let iv
    if (view === 'loading') {
      setLoadingStep(0)
      iv = setInterval(() => setLoadingStep(s => s < LOADING_STEPS.length - 1 ? s + 1 : s), 2600)
    }
    if (view === 'writing') {
      setWriteStep(0)
      iv = setInterval(() => setWriteStep(s => s < WRITE_STEPS.length - 1 ? s + 1 : s), 2200)
    }
    return () => clearInterval(iv)
  }, [view])

  const handleSubmit = async () => {
    setError(null)
    setAdroitScript(null)
    setResult(null)
    setView('loading')

    // Step 1 — run evaluation
    let evalResult
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: sub }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Evaluation failed')
      evalResult = data.result
      setResult(evalResult)
    } catch (e) {
      setError(e.message)
      setView('form')
      return
    }

    // Step 2 — generate Adroit script
    setView('writing')

    // Build a brief for the generator from test inputs + evaluation findings
    const ci = evalResult?.category_insight || {}
    const brief = {
      brandName:        sub.brand,
      productService:   sub.category,
      targetAudience:   sub.audience || '',
      platform:         sub.platform,
      duration:         '30 seconds',   // sensible default
      objective:        sub.objective,
      brandEquity:      'medium',
      distinctiveAssets: sub.distinctiveAssets || '',
      dialogueLevel:    'moderate',
      keyMessage:       ci.insight_used || ci.white_space || '',
      mandatories:      '',
      brandWebsite:     '',
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      })
      const data = await res.json()
      if (data.output) setAdroitScript(data.output)
    } catch (_) {
      // Script generation failing silently is acceptable — results still show
    }

    setView('results')
  }

  return (
    <>
      <Head>
        <title>Adroit — Test Your Script</title>
        <meta name="description" content="Ad script testing engine — insight quality and execution scoring" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header activeTab="Test" />
      {view === 'form'    && <TestForm sub={sub} setSub={setSub} onSubmit={handleSubmit} error={error} />}
      {view === 'loading' && <LoadingScreen step={loadingStep} steps={LOADING_STEPS} label={'Testing Your Script'} />}
      {view === 'writing' && <LoadingScreen step={writeStep}   steps={WRITE_STEPS}   label={'Writing Your Script'} />}
      {view === 'results' && result && <TestResults result={result} adroitScript={adroitScript} onReset={() => { setView('form'); setResult(null); setAdroitScript(null) }} />}
    </>
  )
}
