import { Link } from 'react-router-dom'
import { OPS_TICKETS } from '../data'
import { useApp } from '../state'
import { Presenter } from '../components/ui'

export default function Ops() {
  const { notes } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Internal teams do not get a raw Zendesk pile. Each ticket carries the conversion case, worker record, analyser score, and the exact decision needed.
        </Presenter>
      )}
      <p className="h1">Ops queue</p>
      <p className="lede">Legal, Country Experts, and Support share one queue. Context travels with the case.</p>
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
              <dl className="kv">
                <dt>Owner</dt>
                <dd>{t.owner}</dd>
                <dt>Worker</dt>
                <dd>
                  <Link to="/people/br-04">{t.worker}</Link>
                </dd>
                <dt>Context</dt>
                <dd>{t.context}</dd>
                <dt>Decision needed</dt>
                <dd>{t.need}</dd>
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
