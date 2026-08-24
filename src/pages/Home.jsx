import { Link } from 'react-router-dom'
import { COMPANY, COUNTRIES } from '../data'
import { useApp } from '../state'
import { Presenter } from '../components/ui'

export default function Home() {
  const { notes, launched, workers, hires } = useApp()
  const blocked = workers.filter((w) => w.block).length
  const converted = workers.filter((w) => w.status === 'converted').length
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Open here in the interview. Show one workforce, not three products. Then click the Brazil banner — that is the Year 1 wedge.
        </Presenter>
      )}
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <p className="h1">Good afternoon, Priya</p>
          <p className="lede">Lumina Labs · 72 people · 14 countries · Contractors, EOR, and Payroll on one record.</p>
        </div>
          <div className="row">
            <Link to="/flow" className="btn btn-mint">Play full flow</Link>
            <Link to="/hire" className="btn btn-primary">Hire someone</Link>
          </div>
      </div>

      {!launched ? (
        <div className="banner banner-risk">
          <div className="pulse" />
          <div style={{ flex: 1 }}>
            <h3>Brazil pejotização crackdown — 10 contractors must move to EOR in {COMPANY.daysLeft} days</h3>
            <p>
              Ministério do Trabalho guidance treats exclusive, subordinate PJ work as CLT. Deadline {COMPANY.deadline}.
              8 people are conversion-ready. {blocked} need Legal or Country Expert before contract.
            </p>
          </div>
          <Link to="/convert" className="btn btn-primary">Start conversion</Link>
        </div>
      ) : (
        <div className="banner banner-ok">
          <div>
            <h3>Brazil conversion launched — {converted}/10 now EOR</h3>
            <p>First CLT payroll locked for 30 Sep 2026. Two exceptions remain in the ops queue with full context attached.</p>
          </div>
          <Link to="/conversion" className="btn btn-ghost">Open command center</Link>
        </div>
      )}

      {(hires || []).length > 0 && (
        <div className="banner banner-ok" style={{ marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <h3>New hire in {hires[0].country} — {hires[0].name}</h3>
            <p>Invite sent. Onboarding as {hires[0].type === 'eor' ? 'EOR' : hires[0].type}. Deposit still unpaid.</p>
          </div>
          <Link to={`/people/${hires[0].id}`} className="btn btn-ghost">Open record</Link>
        </div>
      )}
      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        <Link to="/finance" className="card stat" style={{ textDecoration: 'none' }}>
          <div className="k">Workforce P&amp;L</div>
          <div className="v">72</div>
          <div className="d">{launched ? '50 EOR · 10 contractor · 12 payroll' : '42 EOR · 18 contractor · 12 payroll'} · open mix</div>
        </Link>
        <div className="card stat">
          <div className="k">Time to hire (last 90d)</div>
          <div className="v">6.4d</div>
          <div className="d up">EOR median · contractor 2.1d</div>
        </div>
        <div className="card stat">
          <div className="k">Next payroll</div>
          <div className="v">31 Aug</div>
          <div className="d">1 exception · funded</div>
        </div>
        <div className="card stat">
          <div className="k">Support tickets / 100</div>
          <div className="v">4.8</div>
          <div className="d down">Brazil conversions will spike this unless the flow is productized</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-h">
            <p className="h2">Where the team sits</p>
            <span className="muted">One map. Three engagement types.</span>
          </div>
          <div className="heatmap">
            {COUNTRIES.map((c) => (
              <div className="heat-row" key={c.name}>
                <span>{c.name}</span>
                <div className="bar mix">
                  <span style={{ width: `${(c.total / 16) * 100}%` }} />
                </div>
                <strong>{c.total}</strong>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-h">
              <p className="h2">Before you hire</p>
              <span className="muted">Checklist</span>
            </div>
            {['Entity vs EOR decision logged', 'Misclassification analyser run', 'Cost calculator shared with Finance', 'Country guide reviewed'].map((t, i) => (
              <div className="check" key={t}>
                <input type="checkbox" defaultChecked={i < 3} readOnly />
                <div>
                  <div style={{ fontWeight: 650, fontSize: 13 }}>{t}</div>
                  {i === 3 && <div className="muted">Brazil guide updated 12 Aug 2026 after enforcement notice.</div>}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <Link to="/hire" className="btn btn-ghost btn-sm">Open hire</Link>
            </div>
          </div>
          <div className="card">
            <p className="h2" style={{ marginBottom: 8 }}>HRIS write-back</p>
            <p className="muted" style={{ marginBottom: 10 }}>Workday · HiBob · Personio. Type flip writes to the same worker. No new person.</p>
            <div className="row">
              <span className="badge b-info">Workday · 21 Aug</span>
              <span className="badge b-info">HiBob · 21 Aug</span>
              <span className={launched ? 'badge b-warn' : 'badge b-ok'}>{launched ? 'Brazil type-flip queued' : 'In sync'}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <Link to="/people/br-01" className="btn btn-ghost btn-sm">See Ana’s record</Link>
              <Link to="/finance" className="btn btn-ghost btn-sm">Workforce P&amp;L</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
