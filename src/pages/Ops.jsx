import { Link } from 'react-router-dom'
import { OPS_TICKETS } from '../data'
import { useApp } from '../state'
import { AiRec, Presenter } from '../components/ui'

export default function Ops() {
  const { notes } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Internal teams get an exception package: profile, docs, trigger, missing items, risk, and a recommended action. AI routes. Humans decide.
        </Presenter>
      )}
      <p className="h1">Ops queue</p>
      <p className="lede">Legal, Country Experts, and Support share one queue. Context travels with the case — not a Zendesk pile.</p>
      <div className="grid" style={{ gap: 12 }}>
        {OPS_TICKETS.map((t) => (
          <div className={`card ops-card ${t.team === 'Legal' ? 'legal' : t.team === 'Support' ? 'support' : 'expert'}`} key={t.id} style={{ padding: 0 }}>
            <div className="stripe" />
            <div style={{ padding: 16 }}>
              <div className="row" style={{ marginBottom: 8 }}>
                <span className="badge b-info">{t.team}</span>
                <span className="muted">{t.id}</span>
                <strong style={{ fontSize: 15 }}>{t.title}</strong>
                <span className="muted right">SLA {t.sla}</span>
              </div>
              <AiRec
                title={t.recommended}
                body={t.route}
                next={t.need}
                human={`${t.owner} owns the decision.`}
                tags={['routing', 'next-best-action']}
              />
              <dl className="kv">
                <dt>Owner</dt>
                <dd>{t.owner}</dd>
                <dt>Worker</dt>
                <dd>
                  <Link to={`/people/${t.workerId}`}>{t.worker}</Link>
                </dd>
                <dt>Trigger</dt>
                <dd>{t.trigger}</dd>
                <dt>On file</dt>
                <dd>{t.docs.join(', ')}</dd>
                <dt>Missing</dt>
                <dd>{t.missing.join(', ')}</dd>
                <dt>Completed</dt>
                <dd>{t.completed.join(' · ')}</dd>
                <dt>Risk</dt>
                <dd>{t.risk}</dd>
              </dl>
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn btn-primary btn-sm">Take ticket</button>
                <button className="btn btn-ghost btn-sm">Ping customer</button>
                <Link to="/conversion" className="btn btn-ghost btn-sm">Open case</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
