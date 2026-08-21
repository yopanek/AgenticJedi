'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, ArrowUpRight, ChevronRight, Clock3, Globe2, ShieldAlert, Siren, TrendingUp } from 'lucide-react'
import { trackEvent } from 'ai-publish-sdk'

type Platform = 'landscape' | 'portrait' | 'expanded' | 'xl' | 'fullpage' | 'sidepanel'
type Severity = 'Critical' | 'High' | 'Elevated'

type Incident = {
  id: number
  severity: Severity
  category: string
  target: string
  region: string
  ago: string
  volume: string
  detail: string
}

const incidents: Incident[] = [
  { id: 1, severity: 'Critical', category: 'Credential harvest', target: 'Microsoft 365', region: 'North America', ago: '2m ago', volume: '18.4k', detail: 'Lookalike sign-in pages targeting enterprise mailboxes.' },
  { id: 2, severity: 'High', category: 'Investment scam', target: 'Crypto wallets', region: 'Western Europe', ago: '7m ago', volume: '9.2k', detail: 'Sponsored posts promising guaranteed returns and fast withdrawals.' },
  { id: 3, severity: 'High', category: 'Delivery smishing', target: 'Parcel services', region: 'APAC', ago: '11m ago', volume: '6.8k', detail: 'SMS campaign directing recipients to a fake rescheduling portal.' },
  { id: 4, severity: 'Elevated', category: 'Business email compromise', target: 'Finance teams', region: 'United Kingdom', ago: '18m ago', volume: '3.1k', detail: 'Invoice redirection attempts using recently registered domains.' },
  { id: 5, severity: 'Elevated', category: 'Support impersonation', target: 'Social platforms', region: 'Latin America', ago: '24m ago', volume: '2.7k', detail: 'Fake account recovery forms distributed through direct messages.' },
]

function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>('fullpage')
  useEffect(() => {
    const detect = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width <= 520 && height >= 700) setPlatform('sidepanel')
      else if (width <= 360) setPlatform('landscape')
      else if (width <= 430 && height <= 650) setPlatform('portrait')
      else if (width <= 780) setPlatform('expanded')
      else if (width <= 1160 && height <= 650) setPlatform('xl')
      else setPlatform('fullpage')
    }
    detect()
    window.addEventListener('resize', detect)
    return () => window.removeEventListener('resize', detect)
  }, [])
  return platform
}

function severityClass(severity: Severity) {
  return severity.toLowerCase()
}

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <header className={compact ? 'ticker-header compact' : 'ticker-header'}>
      <div className="brand-lockup">
        <span className="signal-mark" aria-hidden="true"><span /><span /><span /></span>
        <div>
          <p className="eyebrow">Threat intelligence</p>
          <h1>Signal / Watch</h1>
        </div>
      </div>
      <div className="live-status"><span className="pulse-dot" /> LIVE <span className="status-time">updated 18 sec ago</span></div>
    </header>
  )
}

function Summary({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? 'summary compact-summary' : 'summary'} aria-label="Threat summary">
      <div className="summary-lead"><span className="summary-kicker"><Activity size={13} /> Global activity</span><strong>+14.8%</strong><span>vs. previous 24h</span></div>
      <div className="metrics">
        <div><span>Active campaigns</span><b>247</b></div>
        <div><span>Domains flagged</span><b>18,402</b></div>
        <div><span>Highest risk</span><b className="critical-text">Critical</b></div>
      </div>
    </section>
  )
}

function IncidentRow({ item, onSelect }: { item: Incident; onSelect: (item: Incident) => void }) {
  return (
    <button className="incident-row" onClick={() => onSelect(item)} aria-label={`View ${item.category} alert for ${item.target}`}>
      <span className={`severity-dot ${severityClass(item.severity)}`} />
      <span className="incident-main"><b>{item.category}</b><span>{item.target} · {item.region}</span></span>
      <span className="incident-volume">{item.volume}<small>hits</small></span>
      <span className="incident-time">{item.ago}</span>
      <ChevronRight className="row-chevron" size={16} />
    </button>
  )
}

function TickerList({ compact = false, onSelect }: { compact?: boolean; onSelect: (item: Incident) => void }) {
  return (
    <section className={compact ? 'ticker-list compact-list' : 'ticker-list'} aria-label="Recent scam activity">
      <div className="section-head"><div><p className="eyebrow">Live feed</p><h2>What’s moving now</h2></div><span className="feed-count">{incidents.length} signals</span></div>
      <div className="incident-stack">{incidents.slice(0, compact ? 3 : incidents.length).map(item => <IncidentRow key={item.id} item={item} onSelect={onSelect} />)}</div>
    </section>
  )
}

function Detail({ item, onClose }: { item: Incident; onClose: () => void }) {
  useEffect(() => { trackEvent({ eventName: 'threat_signal_opened', additionalDetails: { category: item.category, severity: item.severity } }).catch(() => undefined) }, [item])
  return <div className="detail-panel"><button className="back-button" onClick={onClose}>← Back to feed</button><div className={`detail-severity ${severityClass(item.severity)}`}><Siren size={16} /> {item.severity} signal</div><h2>{item.category}</h2><p className="detail-target">Targeting {item.target} across {item.region}</p><div className="detail-stat"><span>Observed volume</span><strong>{item.volume} <small>hits</small></strong></div><p>{item.detail}</p><div className="detail-note"><ShieldAlert size={16} /><span>Stay cautious: never enter credentials from an unsolicited link.</span></div></div>
}

function Landscape({ onSelect }: { onSelect: (item: Incident) => void }) {
  return <><Header compact /><div className="landscape-tabs"><span className="active">Live</span><span>Top threats</span><span>Regions</span></div><div className="landscape-ticker">{incidents.slice(0, 3).map(item => <IncidentRow key={item.id} item={item} onSelect={onSelect} />)}</div></>
}

function Portrait({ selected, onSelect, onClose }: { selected: Incident | null; onSelect: (item: Incident) => void; onClose: () => void }) {
  return selected ? <Detail item={selected} onClose={onClose} /> : <><Header compact /><Summary compact /><TickerList compact onSelect={onSelect} /><footer className="ticker-footer">Signal / Watch · public threat telemetry</footer></>
}

function Desktop({ selected, onSelect, onClose, wide = false }: { selected: Incident | null; onSelect: (item: Incident) => void; onClose: () => void; wide?: boolean }) {
  if (selected) return <Detail item={selected} onClose={onClose} />
  return <><Header /><Summary /><div className={wide ? 'wide-content' : 'desktop-content'}><TickerList onSelect={onSelect} /><aside className="side-brief"><p className="eyebrow">Analyst brief</p><h2>Trust is under pressure.</h2><p>Credential theft remains the dominant attack pattern today, with hosted lookalikes making up 62% of newly flagged domains.</p><div className="brief-line"><TrendingUp size={16} /><span>Highest velocity</span><b>+28.6%</b></div><div className="brief-line"><Globe2 size={16} /><span>Most targeted</span><b>North America</b></div><button className="explore-button" onClick={() => trackEvent({ eventName: 'threat_feed_explored' }).catch(() => undefined)}>Explore full signal map <ArrowUpRight size={16} /></button></aside></div><footer className="ticker-footer"><span>Sources: community reports · domain telemetry · abuse desks</span><span>All times UTC</span></footer></>
}

export default function Page() {
  const platform = usePlatform()
  const [selected, setSelected] = useState<Incident | null>(null)
  const compact = platform === 'landscape' || platform === 'portrait' || platform === 'sidepanel'
  const content = platform === 'landscape' ? <Landscape onSelect={setSelected} /> : platform === 'portrait' || platform === 'sidepanel' ? <Portrait selected={selected} onSelect={setSelected} onClose={() => setSelected(null)} /> : <Desktop selected={selected} onSelect={setSelected} onClose={() => setSelected(null)} wide={platform === 'xl'} />
  return <main className={`ticker-shell platform-${platform} ${compact ? 'is-compact' : ''}`}>{content}</main>
}
