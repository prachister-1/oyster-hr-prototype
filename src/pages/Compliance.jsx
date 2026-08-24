import { Link } from 'react-router-dom'
import { COMPANY, DISCOVERY } from '../data'
import { useApp } from '../state'
import { Presenter, AiRec } from '../components/ui'

export default function Compliance() {
  const { notes, workers } = useApp()
  const avg = Math.round(workers.reduce((s, w) => s + w.risk, 0) / workers.length)
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Discovery first, then the journey. This screen is what you would coach a PM to produce after a week in the wild — not a feature list.
        </Presenter>
      )}
      <p className="h1">Compliance</p>
      <p className="lede">Live risk on the workforce, plus the discovery path behind the Brazil conversion.</p>
      <AiRec
        title="Brazil is the open case. India is next to score — not a second war room."
        body="10 Brazil PJ contractors are a 30-day conversion. Three India contractors are exclusive product work with no entity on file. Mexico is a watch. AI ranks pockets; it does not open a case without a trigger."
        next="Run Brazil conversion now. After launch, score India contractors before SOW renewal."
        human="Country Expert BR on exceptions. India expert only if eligibility is ambiguous."
        tags={['risk flagging', 'next-best-action']}
      />

      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        <div className="card stat">
          <div className="k">Open conversion cases</div>
          <div className="v">1</div>
          <div className="d">Brazil · {COMPANY.daysLeft} days</div>
        </div>
        <div className="card stat">
          <div className="k">Workers in case</div>
          <div className="v">{workers.length}</div>
          <div className="d">Avg analyser {avg}/100</div>
        </div>
        <div className="card stat">
          <div className="k">Blocked</div>
          <div className="v">{workers.filter((w) => w.block).length}</div>
          <div className="d">Legal + identity</div>
        </div>
        <div className="card stat">
          <div className="k">Oyster Shell</div>
          <div className="v">$50k</div>
          <div className="d">Per claim · templates only</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-h">
            <p className="h2">Brazil case — root cause</p>
            <span className="badge b-risk">Urgent</span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-2)', marginTop: 0 }}>
            Lumina hired 10 Brazilian specialists as PJ contractors because it was fast and cheap. The working pattern is employment: exclusive hours, Lumina managers, Lumina tools. A 2026 enforcement wave makes that legally unsafe. The product problem is not “generate a CLT contract.” It is moving 10 people across classification, compensation, consent, and payroll in 30 days without burying Legal, Support, and Country Experts in Slack.
          </p>
          <div className="row" style={{ marginTop: 8 }}>
            <Link to="/convert" className="btn btn-primary">Design the conversion</Link>
            <Link to="/conversion" className="btn btn-ghost">Command center</Link>
          </div>
        </div>
        <div className="card">
          <p className="h2" style={{ marginBottom: 10 }}>Discovery you coach the PM through</p>
          {DISCOVERY.map((d) => (
            <div className="check" key={d.who}>
              <input type="checkbox" defaultChecked readOnly />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{d.who}</div>
                <div className="muted">{d.what}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
