import Head from 'next/head'
import { useState, useEffect } from 'react'

const LOADING_STEPS = [
  'Diagnosing brand equity',
  'Mapping platform attention profile',
  'Calibrating show / sell ratio',
  'Designing emotional arc',
  'Placing distinctive assets',
  'Running bias toolkit',
  'Writing scenes second by second',
  'Applying psycho-logic principles',
  'Finalising shoot-ready script',
]

const GOAL_STYLES = {
  HOOK:           { bg: '#DBEAFE', color: '#1D4ED8' },
  'BRAND BURN':   { bg: '#FEF3C7', color: '#92400E' },
  'EMOTION BUILD':{ bg: '#DBEAFE', color: '#1D4ED8' },
  TENSION:        { bg: '#FEE2E2', color: '#991B1B' },
  PEAK:           { bg: '#DC2626', color: '#FFFFFF' },
  RESOLUTION:     { bg: '#DCFCE7', color: '#14532D' },
  CTA:            { bg: '#F5F5F2', color: '#5A5A55' },
  'CLOSING BRAND':{ bg: '#FEF3C7', color: '#92400E' },
}

function goalStyle(goal = '') {
  for (const [key, val] of Object.entries(GOAL_STYLES)) {
    if (goal.toUpperCase().includes(key)) return val
  }
  return { bg: '#F5F5F2', color: '#5A5A55' }
}

// ── HEADER ────────────────────────────────────────────────────────────
function Header() {
  return (
    <header style={{
      borderBottom: '1px solid #0A0A0A',
      padding: '0',
      background: '#0A0A0A',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.06em',
            color: '#F59E0B',
            textTransform: 'uppercase',
          }}>The Script Brain</span>
          <span style={{ fontSize: 10, color: '#5A5A55', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Behavioral Science · Script Architecture</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['■','■','■'].map((s, i) => (
            <span key={i} style={{ fontSize: 6, color: i === 0 ? '#F59E0B' : '#333', letterSpacing: 2 }}>{s}</span>
          ))}
        </div>
      </div>
    </header>
  )
}

// ── FORM ──────────────────────────────────────────────────────────────
function BriefForm({ brief, setBrief, onSubmit, error, loading }) {
  const fields1 = [
    { key: 'brandName',      label: 'Brand name',         placeholder: 'e.g. Zomato', col: 1 },
    { key: 'productService', label: 'Product or service',  placeholder: 'e.g. Food delivery app', col: 1 },
    { key: 'platform',       label: 'Platform',            placeholder: 'e.g. Instagram Reels, TV 30s, YouTube', col: 1 },
    { key: 'duration',       label: 'Duration',            placeholder: 'e.g. 30 seconds', col: 1 },
  ]

  const canSubmit = brief.brandName && brief.platform && brief.duration && brief.objective

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid #0A0A0A' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 12 }}>
          Classified · Proprietary
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          lineHeight: 0.9,
          color: '#0A0A0A',
          marginBottom: 16,
        }}>
          The<br/>Script<br/>Brain
        </h1>
        <p style={{ fontSize: 13, color: '#5A5A55', maxWidth: 400, lineHeight: 1.7 }}>
          Second-by-second, shoot-ready scripts grounded in 8 books of behavioral science research. Every scene has a psychological reason to exist.
        </p>
      </div>

      {/* Form */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 24 }}>
          The brief
        </div>

        {/* Row 1: Brand + Product */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
          {fields1.slice(0, 2).map(f => (
            <div key={f.key} style={{ border: '1px solid #0A0A0A', padding: '16px 20px', background: '#fff' }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>{f.label}</label>
              <input value={brief[f.key]} onChange={e => setBrief({ ...brief, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ border: 'none', padding: 0, fontSize: 14, fontWeight: 500, background: 'transparent', outline: 'none', width: '100%' }} />
            </div>
          ))}
        </div>

        {/* Row 2: Platform + Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
          {fields1.slice(2, 4).map(f => (
            <div key={f.key} style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px', background: '#fff' }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>{f.label}</label>
              <input value={brief[f.key]} onChange={e => setBrief({ ...brief, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ border: 'none', padding: 0, fontSize: 14, fontWeight: 500, background: 'transparent', outline: 'none', width: '100%' }} />
            </div>
          ))}
        </div>

        {/* Target audience + Objective */}
        {[
          { key: 'targetAudience', label: 'Target audience', placeholder: 'e.g. Urban millennials 24–35, working professionals' },
          { key: 'objective',      label: 'Campaign objective', placeholder: 'e.g. Brand awareness, app downloads, product launch' },
        ].map(f => (
          <div key={f.key} style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px', background: '#fff' }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>{f.label}</label>
            <input value={brief[f.key]} onChange={e => setBrief({ ...brief, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ border: 'none', padding: 0, fontSize: 14, fontWeight: 500, background: 'transparent', outline: 'none', width: '100%' }} />
          </div>
        ))}

        {/* Brand equity */}
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px', background: '#fff' }}>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 12 }}>Brand equity level</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['low', 'medium', 'high'].map(lvl => (
              <button key={lvl} onClick={() => setBrief({ ...brief, brandEquity: lvl })} style={{
                padding: '7px 20px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                background: brief.brandEquity === lvl ? '#0A0A0A' : 'transparent',
                color: brief.brandEquity === lvl ? '#F59E0B' : '#9B9B95',
                border: brief.brandEquity === lvl ? '1px solid #0A0A0A' : '1px solid #E8E8E4',
                borderRadius: 2,
                transition: 'all 0.15s',
              }}>{lvl}</button>
            ))}
          </div>
        </div>

        {/* Optional fields */}
        {[
          { key: 'distinctiveAssets', label: 'Existing distinctive assets', placeholder: 'e.g. brand jingle, mascot, signature color, tagline. Leave empty if none.' },
          { key: 'keyMessage',        label: 'Key message',                 placeholder: 'e.g. Zomato delivers in 30 minutes, rain or shine' },
          { key: 'mandatories',       label: 'Mandatories & constraints',   placeholder: 'e.g. must show product shot, no competitor mentions, logo at end' },
        ].map(f => (
          <div key={f.key} style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px', background: '#fff' }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>
              {f.label} <span style={{ color: '#E8E8E4', fontSize: 9 }}>optional</span>
            </label>
            <textarea value={brief[f.key]} onChange={e => setBrief({ ...brief, [f.key]: e.target.value })} placeholder={f.placeholder} rows={2} style={{ border: 'none', padding: 0, fontSize: 13, background: 'transparent', outline: 'none', width: '100%', resize: 'vertical', color: '#0A0A0A' }} />
          </div>
        ))}

        {/* Submit */}
        <button onClick={onSubmit} disabled={!canSubmit}
          style={{
            display: 'block', width: '100%', marginTop: 1,
            padding: '18px 24px',
            fontFamily: 'var(--font-display)',
            fontSize: 18, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            background: canSubmit ? '#0A0A0A' : '#E8E8E4',
            color: canSubmit ? '#F59E0B' : '#9B9B95',
            border: '1px solid #0A0A0A',
            borderTop: 'none',
            transition: 'all 0.15s',
          }}>
          Generate Script →
        </button>

        {error && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#FEE2E2', border: '1px solid #DC2626', fontSize: 12, color: '#991B1B' }}>
            {error}
          </div>
        )}
      </div>
    </main>
  )
}

// ── LOADING ───────────────────────────────────────────────────────────
function LoadingScreen({ step, total }) {
  const pct = Math.round((step / total) * 100)
  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: '60vh', justifyContent: 'center' }}>

      {/* Big title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 80,
        fontWeight: 900,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        lineHeight: 0.85,
        color: '#0A0A0A',
        marginBottom: 48,
        opacity: 0.08,
        userSelect: 'none',
      }}>
        Writing<br/>Your<br/>Script
      </div>

      {/* Panels */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 32 }}>
        {LOADING_STEPS.map((_, i) => (
          <div key={i} style={{
            width: 28,
            height: 4,
            background: i < step ? '#F59E0B' : i === step ? '#0A0A0A' : '#E8E8E4',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Current step */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 6 }}>
          Step {step + 1} of {total}
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#0A0A0A' }}>
          {LOADING_STEPS[Math.min(step, LOADING_STEPS.length - 1)]}
          <span style={{ animation: 'pulse 1.2s ease-in-out infinite', display: 'inline-block', marginLeft: 4, color: '#F59E0B' }}>_</span>
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#9B9B95', marginTop: 16 }}>
        {pct}% complete · The brain is working
      </div>
    </main>
  )
}

// ── SCIENCE COLLAPSIBLE ──────────────────────────────────────────────
function ScienceBox({ overview }) {
  const [open, setOpen] = useState(false)
  const sci = overview?.science_overview || {}

  return (
    <div style={{ border: '1px solid #0A0A0A', marginTop: 1 }}>
      <button className="collapsible-trigger" onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', cursor: 'pointer', border: 'none', background: open ? '#F5F5F2' : '#fff',
        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em', color: '#0A0A0A', textAlign: 'left',
        transition: 'background 0.15s',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, color: '#F59E0B' }}>◆</span>
          Know the science behind this
        </span>
        <span style={{ fontSize: 16, color: '#9B9B95', fontWeight: 400, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>↓</span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #0A0A0A' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>

            {/* Brain mode strategy */}
            <div style={{ padding: '24px 20px', borderRight: '1px solid #E8E8E4', borderBottom: '1px solid #E8E8E4' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 10 }}>Brain mode strategy</div>
              <p style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75 }}>{sci.brain_mode_strategy || '—'}</p>
            </div>

            {/* Key principles */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid #E8E8E4' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 10 }}>Key science principles</div>
              <p style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75 }}>{sci.key_principles || '—'}</p>
            </div>

            {/* Biases deployed */}
            <div style={{ padding: '24px 20px', borderRight: '1px solid #E8E8E4' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 10 }}>Biases deployed</div>
              {(sci.biases_deployed || []).map((b, i) => {
                const [name, ...rest] = b.split('—')
                return (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0A0A0A', marginBottom: 2 }}>{name?.trim()}</div>
                    {rest.length > 0 && <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.6 }}>{rest.join('—').trim()}</div>}
                  </div>
                )
              })}
            </div>

            {/* Brand memory architecture */}
            <div style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 10 }}>Brand memory architecture</div>
              <p style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75 }}>{sci.brand_memory_architecture || '—'}</p>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

// ── OUTPUT ────────────────────────────────────────────────────────────
function ScriptOutput({ output, meta, onReset }) {
  const ov = output?.overview || {}
  const scenes = output?.scenes || []
  const checklist = output?.brand_checklist || {}
  const flags = output?.red_flags || []

  const COLS = [
    { label: '① Time',              key: 'timecode',    w: 90  },
    { label: '② Scene',             key: 'scene',       w: 230 },
    { label: '③ Shot type',         key: 'shot_type',   w: 140 },
    { label: '④ Script & dialogue', key: 'script',      w: 230 },
    { label: '⑤ Music & SFX',       key: 'music_sfx',   w: 170 },
    { label: '⑥ Scene goal',        key: 'scene_goal',  w: 130 },
  ]

  return (
    <main style={{ maxWidth: 1360, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* Back + model badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button onClick={onReset} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B95', cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← New brief
        </button>
        {meta && (
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#9B9B95', textTransform: 'uppercase' }}>
            Generated via {meta.tier} · {meta.model}
          </div>
        )}
      </div>

      {/* Script title */}
      <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #0A0A0A' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>Script output</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1, color: '#0A0A0A' }}>
          {ov.script_title || 'Script Output'}
        </h2>
      </div>

      {/* 4 summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: 1 }}>
        {[
          { label: 'Platform',      val: ov.platform },
          { label: 'Duration',      val: ov.duration },
          { label: 'Creative mode', val: ov.creative_mode },
          { label: 'Show / Sell',   val: ov.showmanship_salesmanship_ratio },
        ].map(c => (
          <div key={c.label} style={{ border: '1px solid #0A0A0A', padding: '16px 20px', background: '#fff' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>{c.val || '—'}</div>
          </div>
        ))}
      </div>

      {/* Emotional arc + psycho-logic */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px 20px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>Emotional arc</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B', marginBottom: 6 }}>{ov.emotional_arc}</div>
          <div style={{ fontSize: 11, color: '#5A5A55' }}>
            Peak at <strong style={{ color: '#0A0A0A' }}>{ov.peak_moment_timing}</strong>
            {ov.dominant_emotion && <> · Dominant: <strong style={{ color: '#0A0A0A' }}>{ov.dominant_emotion}</strong></>}
          </div>
        </div>
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', borderLeft: 'none', padding: '20px 20px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8 }}>Psycho-logic principle</div>
          <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{ov.psycho_logic_principle}</div>
        </div>
      </div>

      {/* 3F */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px 20px', marginBottom: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 16 }}>3F framework</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {[
            { f: 'Fluency',  key: 'fluency',  border: '#2563EB' },
            { f: 'Feeling',  key: 'feeling',  border: '#DC2626' },
            { f: 'Fame',     key: 'fame',     border: '#F59E0B' },
          ].map(({ f, key, border }) => (
            <div key={key} style={{ paddingLeft: 14, borderLeft: `2px solid ${border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>{f}</div>
              <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.7 }}>{ov['3f_assessment']?.[key]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Director notes */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', borderLeft: '4px solid #F59E0B', padding: '20px 20px', marginBottom: 32, background: '#FFFBEB' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#92400E', marginBottom: 8 }}>Director's notes</div>
        <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75 }}>{ov.director_notes}</div>
      </div>

      {/* THE TABLE */}
      <div style={{ border: '1px solid #0A0A0A', marginBottom: 1, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #0A0A0A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#F59E0B' }}>Second-by-second script</div>
            <div style={{ fontSize: 10, color: '#5A5A55', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Every scene · Every beat · Shoot ready</div>
          </div>
          <div style={{ fontSize: 10, color: '#5A5A55' }}>{scenes.length} scenes</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: COLS.reduce((s, c) => s + c.w, 0) }}>
            <thead>
              <tr>
                {COLS.map(c => <th key={c.key} style={{ minWidth: c.w }}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {scenes.map((sc, i) => {
                const gs = goalStyle(sc.scene_goal)
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8' }}>
                    <td>
                      <span style={{ display: 'inline-block', background: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 10, padding: '3px 10px', letterSpacing: '0.05em', borderRadius: 2 }}>
                        {sc.timecode}
                      </span>
                    </td>
                    <td style={{ maxWidth: 230, color: '#0A0A0A' }}>{sc.scene}</td>
                    <td style={{ maxWidth: 140, color: '#5A5A55', fontSize: 11 }}>{sc.shot_type}</td>
                    <td style={{ maxWidth: 230 }}>
                      <div style={{ color: '#0A0A0A', fontSize: 12, fontStyle: sc.script?.includes('No dialogue') ? 'italic' : 'normal', color: sc.script?.includes('No dialogue') ? '#9B9B95' : '#0A0A0A' }}>{sc.script}</div>
                      {sc.on_screen_text && sc.on_screen_text !== 'null' && sc.on_screen_text !== null && (
                        <div style={{ marginTop: 6, display: 'inline-block', background: '#FEF3C7', color: '#92400E', fontSize: 10, padding: '2px 8px', borderRadius: 2, fontWeight: 600 }}>
                          TEXT: {sc.on_screen_text}
                        </div>
                      )}
                    </td>
                    <td style={{ maxWidth: 170, color: '#5A5A55', fontSize: 11 }}>{sc.music_sfx}</td>
                    <td>
                      <span style={{ display: 'inline-block', background: gs.bg, color: gs.color, fontWeight: 700, fontSize: 9, padding: '4px 10px', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>
                        {sc.scene_goal}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Science collapsible */}
      <ScienceBox overview={ov} />

      {/* Checklist + Red flags */}
      <div style={{ display: 'grid', gridTemplateColumns: flags.length > 0 ? '1fr 1fr' : '1fr', gap: 1, marginTop: 1 }}>
        <div style={{ border: '1px solid #0A0A0A', padding: '20px 20px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 16 }}>Brand science checklist</div>
          {Object.entries(checklist).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F5F5F2' }}>
              <span style={{ fontSize: 11, color: '#5A5A55' }}>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: val ? '#16A34A' : '#DC2626' }}>{val ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>

        {flags.length > 0 && (
          <div style={{ border: '1px solid #DC2626', borderLeft: '4px solid #DC2626', padding: '20px 20px', background: '#FEF2F2' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#991B1B', marginBottom: 16 }}>Red flags</div>
            {flags.map((flag, i) => (
              <div key={i} style={{ fontSize: 11, color: '#991B1B', lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: '2px solid #DC2626' }}>{flag}</div>
            ))}
          </div>
        )}
      </div>

      {/* Distinctive assets */}
      {ov.distinctive_assets_deployed?.length > 0 && (
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px 20px' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 12 }}>Distinctive assets deployed</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ov.distinctive_assets_deployed.map((a, i) => (
              <span key={i} style={{ background: '#0A0A0A', color: '#F59E0B', fontWeight: 600, fontSize: 10, padding: '5px 14px', letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: 2 }}>{a}</span>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

// ── ROOT PAGE ──────────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState('form')
  const [loadingStep, setLoadingStep] = useState(0)
  const [brief, setBrief] = useState({
    brandName: '', productService: '', targetAudience: '',
    platform: '', duration: '', objective: '',
    brandEquity: 'medium', distinctiveAssets: '', keyMessage: '', mandatories: '',
  })
  const [output, setOutput] = useState(null)
  const [meta, setMeta] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let interval
    if (step === 'loading') {
      setLoadingStep(0)
      interval = setInterval(() => {
        setLoadingStep(s => (s < LOADING_STEPS.length - 1 ? s + 1 : s))
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [step])

  const handleGenerate = async () => {
    setError(null)
    setStep('loading')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setOutput(data.output)
      setMeta({ model: data.model, tier: data.tier })
      setStep('output')
    } catch (e) {
      setError(e.message)
      setStep('form')
    }
  }

  return (
    <>
      <Head>
        <title>The Script Brain</title>
        <meta name="description" content="Behavioral science-powered shoot-ready script generation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {step === 'form' && (
        <BriefForm brief={brief} setBrief={setBrief} onSubmit={handleGenerate} error={error} />
      )}
      {step === 'loading' && (
        <LoadingScreen step={loadingStep} total={LOADING_STEPS.length} />
      )}
      {step === 'output' && output && (
        <ScriptOutput output={output} meta={meta} onReset={() => { setStep('form'); setOutput(null); setMeta(null) }} />
      )}
    </>
  )
}
