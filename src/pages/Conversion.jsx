import { Link, useNavigate } from 'react-router-dom'
import { COMPANY } from '../data'
import { useApp } from '../state'
import { Avatar, Presenter, StatusBadge } from '../components/ui'

const LANES = [
  { id: 'auto', title: 'Product automation', items: ['Case opened from country-rule feed', 'Analyser scored 10/10 as EOR', 'CLT packages priced', '8 contracts generated', 'HRIS type-flip queued'] },
  { id: 'cust', title: 'Lumina (Priya)', items: ['Confirm headcount in scope', 'Approve CLT packages + deposit', 'Name managers for new employees', 'Fund Sep pre-funding invoice'] },
  { id: 'expert', title: 'Country Expert', items: ['Confirm pejotização read', '32h exception for Gabriela', 'Re-verify João CPF', 'Benefits / union notes'] },
  { id: 'legal', title: 'Legal', items: ['IP novation — Diego', 'Template lock (no custom CLT)', 'PE risk memo for Finance'] },
  { id: 'work', title: 'Workers', items: ['Read offer + take-home', 'Upload missing docs', 'E-sign CLT', 'Ask Support in-thread'] },
]

export default function Conversion() {
  const nav = useNavigate()
  const { notes, workers, launched } = useApp()
  const done = workers.filter((w) => w.status === 'converted').length
  const blocked = workers.filter((w) => w.status === 'blocked' || w.block).length
  return (
    <div className="page">
      {notes && (
        <Presenter>
          This is the slide-9 journey, live. Swimlanes show who owns each beat. Click a worker to the person record.
        </Presenter>
      )}
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <p className="h1">Conversion command center</p>
          <p className="lede">Brazil · Contractor → EOR · deadline {COMPANY.deadline}</p>
        </div>
        <Link to="/convert" className="btn btn-ghost">Open wizard</Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        <div className="card stat">
          <div className="k">Progress</div>
          <div className="v">{done}/10</div>
          <div className="progress mint" style={{ marginTop: 8 }}>
            <span style={{ width: `${(done / 10) * 100}%` }} />
          </div>
        </div>
        <div className="card stat">
          <div className="k">Blocked</div>
          <div className="v">{blocked}</div>
          <div className="d">Still have full context in Ops</div>
        </div>
        <div className="card stat">
          <div className="k">Days remaining</div>
          <div className="v">{COMPANY.daysLeft}</div>
          <div className="d">{launched ? 'Launched — watch exceptions' : 'Not launched yet'}</div>
        </div>
        <div className="card stat">
          <div className="k">Tickets spawned</div>
          <div className="v">3</div>
          <div className="d">Not 30 email threads</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <p className="h2" style={{ marginBottom: 12 }}>Who does what</p>
        <div className="grid lanes" style={{ gap: 10 }}>
          {LANES.map((l) => (
            <div key={l.id} style={{ background: 'var(--paper)', borderRadius: 10, padding: 12 }}>
              <div className="muted" style={{ fontWeight: 800, marginBottom: 8 }}>{l.title}</div>
              {l.items.map((i) => (
                <div key={i} style={{ fontSize: 12, padding: '5px 0', borderTop: '1px solid var(--line)' }}>{i}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-sidebar">
        <div className="card pad-0">
          <table className="table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Status</th>
                <th>Owner if stuck</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} className="click" onClick={() => nav(`/people/${w.id}`)}>
                  <td>
                    <div className="person">
                      <Avatar name={w.name} />
                      <div>
                        <div className="name">{w.name}</div>
                        <div className="sub">{w.role}</div>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={w.status} /></td>
                  <td className="muted">{w.block === 'ip' ? 'Legal' : w.block === 'docs' ? 'Country Expert' : 'Automation'}</td>
                  <td>{w.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <p className="h2" style={{ marginBottom: 10 }}>Decision points & risks</p>
          <div className="timeline">
            <div className="tl">
              <div className="dot auto" />
              <div>
                <h4>Convert vs terminate vs entity</h4>
                <p>Finance could cut contractors. Product should surface cost of each path. Default: convert — talent is the asset.</p>
              </div>
            </div>
            <div className="tl">
              <div className="dot human" />
              <div>
                <h4>Take-home vs employer cost</h4>
                <p>If CLT take-home drops, workers refuse. Package to hold net pay. Watch gross margin on the 10 seats.</p>
              </div>
            </div>
            <div className="tl">
              <div className="dot human" />
              <div>
                <h4>Exceptions that miss the cutoff</h4>
                <p>Diego / João can convert in wave 2 if Legal slips — but payroll must not pay them as PJ after 21 Sep.</p>
              </div>
            </div>
            <div className="tl">
              <div className="dot auto" />
              <div>
                <h4>Double-pay / missed statutory</h4>
                <p>Automation locks last PJ and first CLT. Highest operational risk in the whole journey.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
