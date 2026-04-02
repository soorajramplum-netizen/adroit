import Head from 'next/head'
import { useState, useEffect } from 'react'

const LOADING_STEPS = [
  'Reading brand intelligence',
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

const DIALOGUE_OPTIONS = [
  {
    key: 'heavy',
    label: 'Heavy',
    desc: 'Characters speak throughout. Dialogue leads.',
  },
  {
    key: 'moderate',
    label: 'Moderate',
    desc: 'Mix of dialogue and visual storytelling.',
  },
  {
    key: 'minimal',
    label: 'Minimal',
    desc: 'Sparse dialogue — visuals and music carry the story.',
  },
  {
    key: 'none',
    label: 'None',
    desc: 'Pure visual execution. No spoken words.',
  },
]

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

// ── SHARED STYLES ─────────────────────────────────────────────────────
const S = {
  panelField: {
    border: '1px solid #0A0A0A',
    padding: '16px 20px',
    background: '#fff',
  },
  panelFieldNoTop: {
    border: '1px solid #0A0A0A',
    borderTop: 'none',
    padding: '16px 20px',
    background: '#fff',
  },
  fieldLabel: {
    display: 'block',
    fontSize: 9,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#9B9B95',
    marginBottom: 8,
  },
  bareInput: {
    border: 'none',
    padding: 0,
    fontSize: 14,
    fontWeight: 500,
    background: 'transparent',
    outline: 'none',
    width: '100%',
    color: '#0A0A0A',
    fontFamily: 'var(--font-body)',
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#9B9B95',
    marginBottom: 8,
  },
}

// ── HEADER ────────────────────────────────────────────────────────────
function Header() {
  return (
    <header style={{ borderBottom: '1px solid #0A0A0A', background: '#0A0A0A' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.1em',
            color: '#F59E0B',
            textTransform: 'uppercase',
          }}>Androit</span>
          <span style={{ fontSize: 9, color: '#3A3A35', letterSpacing: '0.18em', textTransform: 'uppercase' }}>by Sooraj Ram</span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 5, height: 5, background: i === 0 ? '#F59E0B' : '#2A2A25', borderRadius: 1 }} />
          ))}
        </div>
      </div>
    </header>
  )
}

// ── BRIEF FORM ────────────────────────────────────────────────────────
function BriefForm({ brief, setBrief, onSubmit, error, fetchingUrl, setFetchingUrl }) {
  const canSubmit = brief.brandName && brief.platform && brief.duration && brief.objective

  function set(key, val) { setBrief(b => ({ ...b, [key]: val })) }

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* Hero block */}
      <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid #0A0A0A' }}>
        <div style={{ ...S.sectionLabel, marginBottom: 12 }}>Classified · Proprietary</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 68,
          fontWeight: 900,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          lineHeight: 0.88,
          color: '#0A0A0A',
          marginBottom: 20,
        }}>
          The<br/>Script<br/>Brain
        </h1>
        <p style={{ fontSize: 13, color: '#5A5A55', maxWidth: 400, lineHeight: 1.75 }}>
          Second-by-second, shoot-ready scripts grounded in 8 books of behavioral science research. Every scene has a psychological reason to exist.
        </p>
      </div>

      {/* ── Section: The Brief ── */}
      <div style={{ ...S.sectionLabel, marginBottom: 20 }}>The brief</div>

      {/* Brand name + Product */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        {[
          { key: 'brandName',      label: 'Brand name',        placeholder: 'e.g. Zomato' },
          { key: 'productService', label: 'Product or service', placeholder: 'e.g. Food delivery app' },
        ].map(f => (
          <div key={f.key} style={S.panelField}>
            <label style={S.fieldLabel}>{f.label}</label>
            <input value={brief[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={S.bareInput} />
          </div>
        ))}
      </div>

      {/* Brand Website — full width */}
      <div style={{ ...S.panelFieldNoTop, display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={S.fieldLabel}>
            Brand website <span style={{ color: '#E8E8E4' }}>optional · we'll read it to understand your brand</span>
          </label>
          <input
            value={brief.brandWebsite}
            onChange={e => set('brandWebsite', e.target.value)}
            placeholder="e.g. https://zomato.com"
            style={S.bareInput}
          />
        </div>
        {brief.brandWebsite && (
          <div style={{ marginTop: 20, fontSize: 10, color: '#9B9B95', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16A34A' }} />
            Will be read on generate
          </div>
        )}
      </div>

      {/* Platform + Duration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        {[
          { key: 'platform', label: 'Platform',   placeholder: 'e.g. Instagram Reels, TV 30s, YouTube pre-roll' },
          { key: 'duration', label: 'Duration',   placeholder: 'e.g. 30 seconds, 15 seconds, 60 seconds' },
        ].map(f => (
          <div key={f.key} style={{ ...S.panelField, borderTop: 'none' }}>
            <label style={S.fieldLabel}>{f.label}</label>
            <input value={brief[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={S.bareInput} />
          </div>
        ))}
      </div>

      {/* Target audience */}
      <div style={S.panelFieldNoTop}>
        <label style={S.fieldLabel}>Target audience</label>
        <input value={brief.targetAudience} onChange={e => set('targetAudience', e.target.value)} placeholder="e.g. Urban millennials 24–35, working professionals" style={S.bareInput} />
      </div>

      {/* Objective */}
      <div style={S.panelFieldNoTop}>
        <label style={S.fieldLabel}>Campaign objective <span style={{ color: '#DC2626', fontSize: 9 }}>required</span></label>
        <input value={brief.objective} onChange={e => set('objective', e.target.value)} placeholder="e.g. Brand awareness, app downloads, product launch" style={S.bareInput} />
      </div>

      {/* Brand equity */}
      <div style={S.panelFieldNoTop}>
        <label style={S.fieldLabel}>Brand equity level</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {['low', 'medium', 'high'].map(lvl => (
            <button key={lvl} onClick={() => set('brandEquity', lvl)} style={{
              padding: '7px 20px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
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

      {/* ── DIALOGUE LEVEL ── */}
      <div style={{ ...S.panelFieldNoTop }}>
        <label style={S.fieldLabel}>Dialogue intensity</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 4 }}>
          {DIALOGUE_OPTIONS.map(opt => {
            const active = brief.dialogueLevel === opt.key
            return (
              <button key={opt.key} onClick={() => set('dialogueLevel', opt.key)} style={{
                padding: '12px 10px',
                cursor: 'pointer',
                background: active ? '#0A0A0A' : 'transparent',
                border: active ? '1px solid #0A0A0A' : '1px solid #E8E8E4',
                borderRadius: 2,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: active ? '#F59E0B' : '#0A0A0A', marginBottom: 4 }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 10, color: active ? '#9B9B90' : '#9B9B95', lineHeight: 1.5 }}>
                  {opt.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Optional fields */}
      {[
        { key: 'distinctiveAssets', label: 'Existing distinctive assets', placeholder: 'e.g. brand jingle, mascot, signature color, tagline — leave empty if none' },
        { key: 'keyMessage',        label: 'Key message',                 placeholder: 'e.g. Zomato delivers in 30 minutes, rain or shine' },
        { key: 'mandatories',       label: 'Mandatories & constraints',   placeholder: 'e.g. must show product shot, no competitor mentions' },
      ].map(f => (
        <div key={f.key} style={S.panelFieldNoTop}>
          <label style={S.fieldLabel}>{f.label} <span style={{ color: '#E8E8E4' }}>optional</span></label>
          <textarea value={brief[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} rows={2}
            style={{ ...S.bareInput, fontSize: 13, fontWeight: 400, resize: 'vertical', lineHeight: 1.6 }} />
        </div>
      ))}

      {/* Submit */}
      <button onClick={onSubmit} disabled={!canSubmit} style={{
        display: 'block',
        width: '100%',
        marginTop: 1,
        padding: '18px 24px',
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        fontWeight: 900,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: canSubmit ? 'pointer' : 'not-allowed',
        background: canSubmit ? '#0A0A0A' : '#E8E8E4',
        color: canSubmit ? '#F59E0B' : '#9B9B95',
        border: 'none',
        transition: 'all 0.15s',
      }}>
        Generate Script →
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: '#FEE2E2', border: '1px solid #DC2626', fontSize: 12, color: '#991B1B' }}>
          {error}
        </div>
      )}
    </main>
  )
}

// ── LOADING SCREEN ─────────────────────────────────────────────────────
function LoadingScreen({ step }) {
  const total = LOADING_STEPS.length
  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: '70vh', justifyContent: 'center' }}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      {/* Ghost title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 80,
        fontWeight: 900,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        lineHeight: 0.85,
        color: '#0A0A0A',
        opacity: 0.06,
        userSelect: 'none',
        marginBottom: 52,
      }}>Writing<br/>Your<br/>Script</div>

      {/* Progress bars */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 32 }}>
        {LOADING_STEPS.map((_, i) => (
          <div key={i} style={{
            width: 26,
            height: 3,
            background: i < step ? '#F59E0B' : i === step ? '#0A0A0A' : '#E8E8E4',
            transition: 'background 0.4s ease',
          }} />
        ))}
      </div>

      {/* Step label */}
      <div style={{ ...S.sectionLabel, marginBottom: 6 }}>Step {step + 1} of {total}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', lineHeight: 1.3 }}>
        {LOADING_STEPS[Math.min(step, total - 1)]}
        <span style={{ animation: 'blink 1.1s step-end infinite', color: '#F59E0B' }}>_</span>
      </div>

      <div style={{ marginTop: 20, fontSize: 11, color: '#9B9B95' }}>
        {Math.round((step / total) * 100)}% — Androit's proprietary intelligence is working
      </div>
    </main>
  )
}

// ── SCIENCE COLLAPSIBLE ───────────────────────────────────────────────
function ScienceBox({ overview }) {
  const [open, setOpen] = useState(false)
  const sci = overview?.science_overview || {}

  return (
    <div style={{ border: '1px solid #0A0A0A', marginTop: 1 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        cursor: 'pointer',
        border: 'none',
        background: open ? '#F9F8F5' : '#fff',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: '0.04em',
        color: '#0A0A0A',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#F59E0B', fontSize: 13 }}>◆</span>
          Know the science behind this
        </span>
        <span style={{
          fontSize: 16,
          color: '#9B9B95',
          fontWeight: 300,
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>↓</span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #0A0A0A' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            <div style={{ padding: '22px 20px', borderRight: '1px solid #E8E8E4', borderBottom: '1px solid #E8E8E4' }}>
              <div style={{ ...S.sectionLabel }}>Brain mode strategy</div>
              <p style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.8 }}>{sci.brain_mode_strategy || '—'}</p>
            </div>

            <div style={{ padding: '22px 20px', borderBottom: '1px solid #E8E8E4' }}>
              <div style={{ ...S.sectionLabel }}>Key science principles</div>
              <p style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.8 }}>{sci.key_principles || '—'}</p>
            </div>

            <div style={{ padding: '22px 20px', borderRight: '1px solid #E8E8E4' }}>
              <div style={{ ...S.sectionLabel }}>Biases deployed</div>
              {(sci.biases_deployed || []).map((b, i) => {
                const [name, ...rest] = b.split('—')
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0A0A0A', marginBottom: 2 }}>{name?.trim()}</div>
                    {rest.length > 0 && <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.65 }}>{rest.join('—').trim()}</div>}
                  </div>
                )
              })}
            </div>

            <div style={{ padding: '22px 20px' }}>
              <div style={{ ...S.sectionLabel }}>Brand memory architecture</div>
              <p style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.8 }}>{sci.brand_memory_architecture || '—'}</p>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

// ── SCRIPT OUTPUT ─────────────────────────────────────────────────────
function ScriptOutput({ output, onReset }) {
  const ov = output?.overview || {}
  const scenes = output?.scenes || []
  const checklist = output?.brand_checklist || {}
  const flags = output?.red_flags || []

  const COLS = [
    { label: '① Time',               key: 'timecode',  w: 90  },
    { label: '② Scene',              key: 'scene',     w: 240 },
    { label: '③ Shot type',          key: 'shot_type', w: 150 },
    { label: '④ Script & dialogue',  key: 'script',    w: 240 },
    { label: '⑤ Music & SFX',        key: 'music_sfx', w: 180 },
    { label: '⑥ Scene goal',         key: 'scene_goal',w: 130 },
  ]

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* Back */}
      <button onClick={onReset} style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: '#9B9B95', cursor: 'pointer', background: 'none', border: 'none', padding: 0,
        marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        ← New brief
      </button>

      {/* Script title */}
      <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #0A0A0A' }}>
        <div style={{ ...S.sectionLabel }}>Script output · Androit</div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 52,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          lineHeight: 0.95,
          color: '#0A0A0A',
          marginTop: 8,
        }}>
          {ov.script_title || 'Script Output'}
        </h2>
      </div>

      {/* 4 summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginBottom: 1 }}>
        {[
          { label: 'Platform',      val: ov.platform },
          { label: 'Duration',      val: ov.duration },
          { label: 'Creative mode', val: ov.creative_mode },
          { label: 'Show / Sell',   val: ov.showmanship_salesmanship_ratio },
        ].map(c => (
          <div key={c.label} style={{ border: '1px solid #0A0A0A', padding: '16px 20px' }}>
            <div style={{ ...S.sectionLabel, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>{c.val || '—'}</div>
          </div>
        ))}
      </div>

      {/* Emotional arc + Psycho-logic */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px' }}>
          <div style={{ ...S.sectionLabel }}>Emotional arc</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', marginBottom: 8 }}>{ov.emotional_arc}</div>
          <div style={{ fontSize: 11, color: '#5A5A55' }}>
            Peak at <strong style={{ color: '#0A0A0A' }}>{ov.peak_moment_timing}</strong>
            {ov.dominant_emotion && <> · Dominant: <strong style={{ color: '#0A0A0A' }}>{ov.dominant_emotion}</strong></>}
          </div>
        </div>
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', borderLeft: 'none', padding: '20px' }}>
          <div style={{ ...S.sectionLabel }}>Psycho-logic principle</div>
          <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75 }}>{ov.psycho_logic_principle}</div>
        </div>
      </div>

      {/* 3F */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px', marginBottom: 1 }}>
        <div style={{ ...S.sectionLabel }}>3F framework</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {[
            { f: 'Fluency', key: 'fluency', accent: '#2563EB' },
            { f: 'Feeling', key: 'feeling', accent: '#DC2626' },
            { f: 'Fame',    key: 'fame',    accent: '#F59E0B' },
          ].map(({ f, key, accent }) => (
            <div key={key} style={{ paddingLeft: 14, borderLeft: `2px solid ${accent}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0A0A0A', marginBottom: 4 }}>{f}</div>
              <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.75 }}>{ov['3f_assessment']?.[key]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Director's notes */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', borderLeft: '4px solid #F59E0B', padding: '20px', marginBottom: 32, background: '#FFFBEB' }}>
        <div style={{ ...S.sectionLabel, color: '#92400E' }}>Director's notes</div>
        <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.8 }}>{ov.director_notes}</div>
      </div>

      {/* TABLE */}
      <div style={{ border: '1px solid #0A0A0A', marginBottom: 1, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #0A0A0A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F59E0B' }}>
              Second-by-second script
            </div>
            <div style={{ fontSize: 9, color: '#5A5A55', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>
              Every scene · Every beat · Shoot ready
            </div>
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
                const noDialogue = !sc.script || sc.script === 'null' || sc.script.toLowerCase().includes('no dialogue')
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8' }}>
                    <td>
                      <span style={{ display: 'inline-block', background: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: 10, padding: '3px 10px', letterSpacing: '0.04em', borderRadius: 2 }}>
                        {sc.timecode}
                      </span>
                    </td>
                    <td style={{ maxWidth: 240, color: '#0A0A0A' }}>{sc.scene}</td>
                    <td style={{ maxWidth: 150, color: '#5A5A55', fontSize: 11 }}>{sc.shot_type}</td>
                    <td style={{ maxWidth: 240 }}>
                      {sc.script && sc.script !== 'null' ? (
                        <div style={{ fontSize: 12, color: noDialogue ? '#9B9B95' : '#0A0A0A', fontStyle: noDialogue ? 'italic' : 'normal', lineHeight: 1.65 }}>
                          {sc.script}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: '#C8C8C2', fontStyle: 'italic' }}>Visual storytelling — no dialogue</div>
                      )}
                      {sc.on_screen_text && sc.on_screen_text !== 'null' && (
                        <div style={{ marginTop: 6, display: 'inline-block', background: '#FEF3C7', color: '#92400E', fontSize: 9, padding: '2px 8px', borderRadius: 2, fontWeight: 700, letterSpacing: '0.05em' }}>
                          TEXT: {sc.on_screen_text}
                        </div>
                      )}
                    </td>
                    <td style={{ maxWidth: 180, color: '#5A5A55', fontSize: 11 }}>{sc.music_sfx}</td>
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
        <div style={{ border: '1px solid #0A0A0A', padding: '20px' }}>
          <div style={{ ...S.sectionLabel }}>Brand science checklist</div>
          {Object.entries(checklist).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F5F5F2' }}>
              <span style={{ fontSize: 11, color: '#5A5A55' }}>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: val ? '#16A34A' : '#DC2626' }}>{val ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>

        {flags.length > 0 && (
          <div style={{ border: '1px solid #DC2626', borderLeft: '4px solid #DC2626', padding: '20px', background: '#FEF2F2' }}>
            <div style={{ ...S.sectionLabel, color: '#991B1B' }}>Red flags</div>
            {flags.map((flag, i) => (
              <div key={i} style={{ fontSize: 11, color: '#991B1B', lineHeight: 1.65, marginBottom: 10, paddingLeft: 12, borderLeft: '2px solid #DC2626' }}>
                {flag}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distinctive assets */}
      {ov.distinctive_assets_deployed?.length > 0 && (
        <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px' }}>
          <div style={{ ...S.sectionLabel }}>Distinctive assets deployed</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ov.distinctive_assets_deployed.map((a, i) => (
              <span key={i} style={{ background: '#0A0A0A', color: '#F59E0B', fontWeight: 700, fontSize: 9, padding: '5px 14px', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

// ── ROOT ───────────────────────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState('form')
  const [loadingStep, setLoadingStep] = useState(0)
  const [brief, setBrief] = useState({
    brandName: '', productService: '', brandWebsite: '',
    targetAudience: '', platform: '', duration: '',
    objective: '', brandEquity: 'medium',
    dialogueLevel: 'moderate',
    distinctiveAssets: '', keyMessage: '', mandatories: '',
  })
  const [output, setOutput] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let iv
    if (view === 'loading') {
      setLoadingStep(0)
      iv = setInterval(() => setLoadingStep(s => s < LOADING_STEPS.length - 1 ? s + 1 : s), 2800)
    }
    return () => clearInterval(iv)
  }, [view])

  const handleGenerate = async () => {
    setError(null)
    setView('loading')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setOutput(data.output)
      setView('output')
    } catch (e) {
      setError(e.message)
      setView('form')
    }
  }

  return (
    <>
      <Head>
        <title>Androit — Script Intelligence</title>
        <meta name="description" content="Behavioral science-powered shoot-ready script generation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {view === 'form' && <BriefForm brief={brief} setBrief={setBrief} onSubmit={handleGenerate} error={error} />}
      {view === 'loading' && <LoadingScreen step={loadingStep} />}
      {view === 'output' && output && <ScriptOutput output={output} onReset={() => { setView('form'); setOutput(null) }} />}
    </>
  )
}
