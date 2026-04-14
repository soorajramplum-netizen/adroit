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

const TIER_CONFIG = {
  'Breakthrough': { color: '#16A34A', bg: '#DCFCE7', bar: '#16A34A' },
  'Strong':       { color: '#2563EB', bg: '#DBEAFE', bar: '#2563EB' },
  'Solid':        { color: '#D97706', bg: '#FEF3C7', bar: '#D97706' },
  'Needs work':   { color: '#DC2626', bg: '#FEE2E2', bar: '#DC2626' },
  'Rethink':      { color: '#7C3AED', bg: '#EDE9FE', bar: '#7C3AED' },
}

const S = {
  panelField: { border: '1px solid #0A0A0A', padding: '16px 20px', background: '#fff' },
  panelNoTop:  { border: '1px solid #0A0A0A', borderTop: 'none', padding: '16px 20px', background: '#fff' },
  label: {
    display: 'block', fontSize: 9, letterSpacing: '0.2em',
    textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8,
  },
  bareInput: {
    border: 'none', padding: 0, fontSize: 14, fontWeight: 500,
    background: 'transparent', outline: 'none', width: '100%',
    color: '#0A0A0A', fontFamily: 'var(--font-body)',
  },
  sectionLabel: {
    fontSize: 9, letterSpacing: '0.25em',
    textTransform: 'uppercase', color: '#9B9B95', marginBottom: 8,
  },
  card: { border: '1px solid #0A0A0A', padding: '20px', background: '#fff' },
}

// ── HEADER ─────────────────────────────────────────────────────────────
function Header({ activeTab }) {
  const router = useRouter()
  return (
    <header style={{ borderBottom: '1px solid #0A0A0A', background: '#0A0A0A' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '0.1em', color: '#F59E0B', textTransform: 'uppercase' }}>
            Androit
          </span>
          <span style={{ fontSize: 9, color: '#3A3A35', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Proprietary Script Intelligence</span>
        </div>
        <nav style={{ display: 'flex', gap: 2 }}>
          {[{ label: 'Write', href: '/' }, { label: 'Test', href: '/test' }].map(t => {
            const active = activeTab === t.label
            return (
              <button key={t.label} onClick={() => router.push(t.href)} style={{
                padding: '6px 18px', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
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

// ── SCORE GAUGE ────────────────────────────────────────────────────────
function ScoreGauge({ score, max, label, accent }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#0A0A0A', lineHeight: 1 }}>
          {score}<span style={{ fontSize: 14, fontWeight: 400, color: '#9B9B95' }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 3, background: '#E8E8E4', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: accent, transition: 'width 1s ease', borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 10, color: '#9B9B95', marginTop: 4 }}>{pct}%</div>
    </div>
  )
}

// ── SCENE SCORE BAR ───────────────────────────────────────────────────
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

// ── SUBMISSION FORM ────────────────────────────────────────────────────
function TestForm({ sub, setSub, onSubmit, error }) {
  const [insightProvided, setInsightProvided] = useState(false)
  const canSubmit = sub.brand && sub.category && sub.platform && sub.objective && sub.script?.trim().length > 40

  function set(k, v) { setSub(s => ({ ...s, [k]: v })) }

  useEffect(() => {
    setSub(s => ({ ...s, insightProvided }))
  }, [insightProvided])

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid #0A0A0A' }}>
        <div style={{ ...S.sectionLabel, marginBottom: 12 }}>Ad Testing Engine</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 68, fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 0.88, color: '#0A0A0A', marginBottom: 20 }}>
          Test<br/>Your<br/>Script
        </h1>
        <p style={{ fontSize: 13, color: '#5A5A55', maxWidth: 460, lineHeight: 1.75 }}>
          Two-layer evaluation: whether your script is built on a real consumer truth for this category, and whether the execution meets behavioral science standards. Scored to 100.
        </p>
      </div>

      {/* Section label */}
      <div style={{ ...S.sectionLabel, marginBottom: 20 }}>The submission</div>

      {/* Brand + Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        {[
          { key: 'brand',    label: 'Brand name',             placeholder: 'e.g. Dove' },
          { key: 'category', label: 'Product / category',     placeholder: 'e.g. Hairfall shampoo, Running shoes, BFSI' },
        ].map(f => (
          <div key={f.key} style={S.panelField}>
            <label style={S.label}>{f.label}</label>
            <input value={sub[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={S.bareInput} />
          </div>
        ))}
      </div>

      {/* Platform + Objective */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        {[
          { key: 'platform',  label: 'Platform',            placeholder: 'e.g. Instagram Reels, TV 30s' },
          { key: 'objective', label: 'Campaign objective',  placeholder: 'e.g. Brand awareness, trial, consideration' },
        ].map(f => (
          <div key={f.key} style={{ ...S.panelField, borderTop: 'none' }}>
            <label style={S.label}>{f.label} <span style={{ color: '#DC2626', fontSize: 9 }}>required</span></label>
            <input value={sub[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={S.bareInput} />
          </div>
        ))}
      </div>

      {/* Audience */}
      <div style={S.panelNoTop}>
        <label style={S.label}>Target audience <span style={{ color: '#9B9B95', fontSize: 9 }}>optional</span></label>
        <input value={sub.audience || ''} onChange={e => set('audience', e.target.value)} placeholder="e.g. Women 25–40, urban, experiencing hairfall" style={S.bareInput} />
      </div>

      {/* Insight toggle */}
      <div style={S.panelNoTop}>
        <div style={{ ...S.label, marginBottom: 14 }}>Do you have an insight this script is based on?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { v: false, label: 'No — generate & test against it', desc: 'Androit will derive the right insight for this category and evaluate your script against it' },
            { v: true,  label: 'Yes — I have one',                desc: 'Paste your insight below and we\'ll test both its strength and how well your script expresses it' },
          ].map(opt => (
            <button key={String(opt.v)} onClick={() => setInsightProvided(opt.v)} style={{
              flex: 1, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
              background: insightProvided === opt.v ? '#0A0A0A' : 'transparent',
              border: insightProvided === opt.v ? '1px solid #0A0A0A' : '1px solid #E8E8E4',
              borderRadius: 2, transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: insightProvided === opt.v ? '#F59E0B' : '#0A0A0A', marginBottom: 4 }}>{opt.label}</div>
              <div style={{ fontSize: 10, color: insightProvided === opt.v ? '#6A6A60' : '#9B9B95', lineHeight: 1.5 }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Insight text — shown only if provided */}
      {insightProvided && (
        <div style={S.panelNoTop}>
          <label style={S.label}>Your insight</label>
          <textarea
            value={sub.insight || ''}
            onChange={e => set('insight', e.target.value)}
            placeholder="e.g. Women experiencing hairfall aren't looking for beautiful hair — they're looking for someone who acknowledges the specific grief of watching their hair change and not being able to stop it..."
            rows={4}
            style={{ ...S.bareInput, fontSize: 13, fontWeight: 400, resize: 'vertical', lineHeight: 1.7 }}
          />
        </div>
      )}

      {/* Script input */}
      <div style={S.panelNoTop}>
        <label style={S.label}>
          Your script <span style={{ color: '#DC2626', fontSize: 9 }}>required</span>
          <span style={{ color: '#9B9B95', fontSize: 9, marginLeft: 6 }}>paste your script, storyboard notes, scene descriptions, or any format</span>
        </label>
        <textarea
          value={sub.script || ''}
          onChange={e => set('script', e.target.value)}
          placeholder={`Scene 1 (0s–5s): Woman wakes up, walks to bathroom mirror...
Scene 2 (5s–12s): Close-up of hairbrush — more hair than usual...
Scene 3 (12s–20s): Product introduction...

Or paste any format — scene-by-scene, full script, bullet points. The engine will read and evaluate it.`}
          rows={14}
          style={{ ...S.bareInput, fontSize: 12, fontWeight: 400, resize: 'vertical', lineHeight: 1.75 }}
        />
      </div>

      <button onClick={onSubmit} disabled={!canSubmit} style={{
        display: 'block', width: '100%', marginTop: 1,
        padding: '18px 24px', fontFamily: 'var(--font-display)',
        fontSize: 18, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
        cursor: canSubmit ? 'pointer' : 'not-allowed',
        background: canSubmit ? '#0A0A0A' : '#E8E8E4',
        color: canSubmit ? '#F59E0B' : '#9B9B95',
        border: 'none', transition: 'all 0.15s',
      }}>
        Run Evaluation →
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: '#FEE2E2', border: '1px solid #DC2626', fontSize: 12, color: '#991B1B' }}>{error}</div>
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
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, color: '#0A0A0A', opacity: 0.06, userSelect: 'none', marginBottom: 52 }}>
        Testing<br/>Your<br/>Script
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 32 }}>
        {LOADING_STEPS.map((_, i) => (
          <div key={i} style={{ width: 26, height: 3, background: i < step ? '#F59E0B' : i === step ? '#0A0A0A' : '#E8E8E4', transition: 'background 0.4s ease' }} />
        ))}
      </div>
      <div style={{ ...S.sectionLabel, marginBottom: 6 }}>Step {step + 1} of {total}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', lineHeight: 1.3 }}>
        {LOADING_STEPS[Math.min(step, total - 1)]}
        <span style={{ animation: 'blink 1.1s step-end infinite', color: '#F59E0B' }}>_</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 11, color: '#9B9B95' }}>
        {Math.round((step / total) * 100)}% — Androit's test engine is working
      </div>
    </main>
  )
}

// ── RESULTS PAGE ───────────────────────────────────────────────────────
function TestResults({ result, onReset }) {
  const [expandedScene, setExpandedScene] = useState(null)
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

      {/* Back */}
      <button onClick={onReset} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9B9B95', cursor: 'pointer', background: 'none', border: 'none', padding: 0, marginBottom: 32 }}>
        ← New evaluation
      </button>

      {/* Title + tier badge */}
      <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #0A0A0A', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ ...S.sectionLabel }}>Evaluation results · {r?.meta?.brand}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 0.95, color: '#0A0A0A', marginTop: 8 }}>
            {r?.meta?.category}
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 900, lineHeight: 1, color: '#0A0A0A' }}>{total}</div>
          <div style={{ fontSize: 10, color: '#9B9B95', letterSpacing: '0.1em' }}>OUT OF 100</div>
        </div>
      </div>

      {/* Verdict banner */}
      <div style={{ border: `1px solid ${tier.color}`, borderLeft: `4px solid ${tier.color}`, padding: '20px 24px', background: tier.bg, marginBottom: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tier.color }}>{verdict.tier}</span>
          <span style={{ fontSize: 9, color: tier.color, opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r?.meta?.platform} · {r?.meta?.objective}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', marginBottom: 8 }}>{verdict.headline}</div>
        <div style={{ fontSize: 12, color: '#5A5A55', lineHeight: 1.75 }}>{verdict.summary}</div>
      </div>

      {/* Score gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
        <div style={{ ...S.card, borderTop: 'none' }}>
          <div style={{ ...S.sectionLabel }}>Insight score</div>
          <ScoreGauge score={ins.subtotal || 0} max={50} label="Total insight" accent="#F59E0B" />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ScoreGauge score={ins.consumer_truth_accuracy?.score || 0} max={20} label="Consumer truth accuracy" accent="#F59E0B" />
            <ScoreGauge score={ins.insight_freshness?.score || 0} max={15} label="Insight freshness" accent="#F59E0B" />
            <ScoreGauge score={ins.insight_execution_coherence?.score || 0} max={15} label="Insight-execution coherence" accent="#F59E0B" />
          </div>
        </div>
        <div style={{ ...S.card, borderTop: 'none', borderLeft: 'none' }}>
          <div style={{ ...S.sectionLabel }}>Execution score</div>
          <ScoreGauge score={exc.subtotal || 0} max={50} label="Total execution" accent="#2563EB" />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ScoreGauge score={exc.dba_architecture?.score || 0} max={10} label="DBA architecture" accent="#2563EB" />
            <ScoreGauge score={exc.emotional_arc?.score || 0} max={10} label="Emotional arc" accent="#2563EB" />
            <ScoreGauge score={exc.platform_alignment?.score || 0} max={10} label="Platform alignment" accent="#2563EB" />
            <ScoreGauge score={exc.bias_deployment?.score || 0} max={10} label="Bias deployment" accent="#2563EB" />
            <ScoreGauge score={exc.three_f_balance?.score || 0} max={10} label="3F balance" accent="#2563EB" />
          </div>
        </div>
      </div>

      {/* Score rationales */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px', marginBottom: 1 }}>
        <div style={{ ...S.sectionLabel, marginBottom: 16 }}>Score rationale</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { label: 'Consumer truth accuracy', data: ins.consumer_truth_accuracy, accent: '#F59E0B' },
            { label: 'Insight freshness',       data: ins.insight_freshness,       accent: '#F59E0B' },
            { label: 'Insight-execution coherence', data: ins.insight_execution_coherence, accent: '#F59E0B' },
            { label: 'DBA architecture',        data: exc.dba_architecture,        accent: '#2563EB' },
            { label: 'Emotional arc',            data: exc.emotional_arc,            accent: '#2563EB' },
            { label: 'Platform alignment',       data: exc.platform_alignment,       accent: '#2563EB' },
            { label: 'Bias deployment',          data: exc.bias_deployment,          accent: '#2563EB' },
            { label: '3F balance',               data: exc.three_f_balance,          accent: '#2563EB' },
          ].map(({ label, data, accent }) => data && (
            <div key={label} style={{ paddingLeft: 12, borderLeft: `2px solid ${accent}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0A0A0A', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.7 }}>{data.rationale}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category insight panel */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', background: '#FFFBEB', borderLeft: '4px solid #F59E0B', padding: '20px', marginBottom: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ ...S.sectionLabel, color: '#92400E' }}>Category insight analysis</div>
          <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B95', background: ci.insight_source === 'provided by user' ? '#DCFCE7' : '#FEF3C7', color: ci.insight_source === 'provided by user' ? '#14532D' : '#92400E', padding: '3px 10px', borderRadius: 2, fontWeight: 700 }}>
            {ci.insight_source === 'provided by user' ? 'User-provided insight' : 'Generated by Androit'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>Primary pain</div>
            <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{ci.primary_pain}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>Psychological pain <span style={{ color: '#D97706' }}>— the real one</span></div>
            <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{ci.psychological_pain}</div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 8 }}>Insight used to evaluate this script</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', lineHeight: 1.7, fontStyle: 'italic' }}>"{ci.insight_used}"</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 8 }}>Category clichés detected</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(ci.category_cliches || []).map((c, i) => (
                <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 2, letterSpacing: '0.04em' }}>{c}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#92400E', marginBottom: 8 }}>White space available</div>
            <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.7 }}>{ci.white_space}</div>
          </div>
        </div>
      </div>

      {/* Scene-by-scene table */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', overflow: 'hidden', marginBottom: 1 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #0A0A0A', background: '#0A0A0A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F59E0B' }}>Scene-by-scene evaluation</div>
            <div style={{ fontSize: 9, color: '#5A5A55', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>Click any scene to expand rationale</div>
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
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8', cursor: 'pointer' }} onClick={() => setExpandedScene(expandedScene === i ? null : i)}>
                  <td style={{ padding: '13px 16px', maxWidth: 140 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#92400E', background: '#FEF3C7', display: 'inline-block', padding: '2px 8px', borderRadius: 2, marginBottom: 4 }}>{sc.timecode}</div>
                    <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.5 }}>{sc.scene_summary}</div>
                  </td>
                  <td style={{ padding: '13px 16px', minWidth: 120 }}>
                    <SceneScoreBar score={sc.execution_score || 0} max={sc.execution_score_max || 10} />
                  </td>
                  <td style={{ padding: '13px 16px', maxWidth: 200 }}>
                    {hasTruth
                      ? <span style={{ fontSize: 11, color: '#14532D', background: '#DCFCE7', padding: '3px 8px', borderRadius: 2, display: 'inline-block', lineHeight: 1.5 }}>{sc.consumer_truth_tapped}</span>
                      : <span style={{ fontSize: 10, color: '#9B9B95', fontStyle: 'italic' }}>None — pure brand delivery</span>}
                  </td>
                  <td style={{ padding: '13px 16px', maxWidth: 200, fontSize: 11, color: '#0A0A0A', lineHeight: 1.6 }}>{sc.whats_working}</td>
                  <td style={{ padding: '13px 16px', maxWidth: 200, fontSize: 11, color: '#DC2626', lineHeight: 1.6 }}>{sc.fix}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Top 3 fixes */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none', padding: '20px', marginBottom: 1 }}>
        <div style={{ ...S.sectionLabel, marginBottom: 16 }}>Top 3 highest-impact fixes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fixes.map((fix, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '16px', background: '#F9F9F7', border: '1px solid #E8E8E4', borderRadius: 2 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: '#E8E8E4', lineHeight: 1, minWidth: 32 }}>
                {fix.priority}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75, marginBottom: 8 }}>{fix.fix}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 2, letterSpacing: '0.08em',
                    background: fix.impact === 'High' ? '#FEE2E2' : '#FEF3C7',
                    color: fix.impact === 'High' ? '#991B1B' : '#92400E',
                  }}>Impact: {fix.impact}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 2, letterSpacing: '0.08em',
                    background: fix.effort === 'Low' ? '#DCFCE7' : fix.effort === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                    color: fix.effort === 'Low' ? '#14532D' : fix.effort === 'Medium' ? '#92400E' : '#991B1B',
                  }}>Effort: {fix.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The one rewrite */}
      <div style={{ border: '1px solid #0A0A0A', borderTop: 'none' }}>
        <button onClick={() => setShowRewrite(r => !r)} style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', cursor: 'pointer', border: 'none',
          background: showRewrite ? '#F9F8F5' : '#fff', fontFamily: 'var(--font-body)',
          fontWeight: 600, fontSize: 12, letterSpacing: '0.04em', color: '#0A0A0A', textAlign: 'left',
          transition: 'background 0.15s',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#DC2626', fontSize: 13 }}>◆</span>
            The one rewrite — {rewrite.scene_reference}
          </span>
          <span style={{ fontSize: 16, color: '#9B9B95', fontWeight: 300, display: 'inline-block', transform: showRewrite ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</span>
        </button>

        {showRewrite && (
          <div style={{ borderTop: '1px solid #0A0A0A' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #E8E8E4', background: '#FFFBEB' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#92400E', marginBottom: 8 }}>Why this scene</div>
              <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75 }}>{rewrite.why_this_scene}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '20px', borderRight: '1px solid #E8E8E4' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 12 }}>Original</div>
                <div style={{ fontSize: 12, color: '#5A5A55', lineHeight: 1.75, fontStyle: 'italic', background: '#FEF2F2', padding: '12px', borderRadius: 2, border: '1px solid #FCA5A5' }}>
                  {rewrite.original}
                </div>
                {rewrite.rewritten_script && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 6 }}>Original script</div>
                    <div style={{ fontSize: 11, color: '#5A5A55', lineHeight: 1.65, fontStyle: 'italic' }}>{rewrite.original_script}</div>
                  </div>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#16A34A', marginBottom: 12 }}>Rewritten</div>
                <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.75, background: '#F0FDF4', padding: '12px', borderRadius: 2, border: '1px solid #86EFAC' }}>
                  {rewrite.rewritten_scene}
                </div>
                {rewrite.rewritten_script && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 6 }}>Rewritten script</div>
                    <div style={{ fontSize: 11, color: '#0A0A0A', lineHeight: 1.65 }}>{rewrite.rewritten_script}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #E8E8E4', background: '#F9F9F7' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B9B95', marginBottom: 10 }}>What changed and why</div>
              <div style={{ fontSize: 12, color: '#0A0A0A', lineHeight: 1.8 }}>{rewrite.what_changed}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// ── ROOT ───────────────────────────────────────────────────────────────
export default function TestPage() {
  const [view, setView] = useState('form')
  const [loadingStep, setLoadingStep] = useState(0)
  const [sub, setSub] = useState({
    brand: '', category: '', platform: '', objective: '',
    audience: '', insightProvided: false, insight: '', script: '',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let iv
    if (view === 'loading') {
      setLoadingStep(0)
      iv = setInterval(() => setLoadingStep(s => s < LOADING_STEPS.length - 1 ? s + 1 : s), 2600)
    }
    return () => clearInterval(iv)
  }, [view])

  const handleSubmit = async () => {
    setError(null)
    setView('loading')
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: sub }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Evaluation failed')
      setResult(data.result)
      setView('results')
    } catch (e) {
      setError(e.message)
      setView('form')
    }
  }

  return (
    <>
      <Head>
        <title>Androit — Test Your Script</title>
        <meta name="description" content="Ad script testing engine — insight quality and execution scoring" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header activeTab="Test" />
      {view === 'form'    && <TestForm sub={sub} setSub={setSub} onSubmit={handleSubmit} error={error} />}
      {view === 'loading' && <LoadingScreen step={loadingStep} />}
      {view === 'results' && result && <TestResults result={result} onReset={() => { setView('form'); setResult(null) }} />}
    </>
  )
}
