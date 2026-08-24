import { Link, useParams } from 'react-router-dom'
import { allPeople, BRAZIL_CONTRACTORS } from '../data'
import { useApp } from '../state'
import { Avatar, Btn, Money, Presenter, StatusBadge, TypeBadge } from '../components/ui'
import HrisStrip from '../components/HrisStrip'

function Eras({ p, converted }) {
  if (!p.invoice && !converted) return null
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <p className="h2" style={{ marginBottom: 8 }}>One ID · two eras</p>
      <p className="muted" style={{ marginBottom: 12 }}>
        Worker ID {p.id} does not change. Engagement type does. Remote would open a second profile. Deel inactivates the old row.
      </p>
      <div className="grid grid-2">
        <div>
          <p className="muted" style={{ fontWeight: 800, marginBottom: 6 }}>PJ era · contractor</p>
          <table className="table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mar 2024 – Jul 2026</td>
                <td><Money value={p.invoice} /> / mo</td>
              </tr>
              <tr>
                <td>Aug 2026 · last PJ</td>
                <td>{converted ? 'Locked · 31 Aug' : 'Scheduled · 31 Aug'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <p className="muted" style={{ fontWeight: 800, marginBottom: 6 }}>CLT era · EOR</p>
          {converted ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Payslip</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sep 2026 · first CLT</td>
                  <td>Draft · 30 Sep · base <Money value={p.cltBase} /></td>
                </tr>
                <tr>
                  <td>Oct 2026 onward</td>
                  <td>On EOR calendar · 15th cut-off</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="note">CLT payslips appear here after launch. Same person. New legal employer: Oyster.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Benefits({ converted, country, onboarding }) {
  if (country !== 'Brazil' && !converted && !onboarding) return null
  const live = converted
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <p className="h2" style={{ marginBottom: 8 }}>Benefits enrolment</p>
      <p className="lede" style={{ marginBottom: 10 }}>Hits the 15th cut-off. Not a benefits marketplace — statutory plus the pack on the Service Agreement.</p>
      <table className="table">
        <tbody>
          <tr>
            <td>INSS / FGTS / 13th / vacation 1/3</td>
            <td>{live ? <span className="badge b-ok">On Sep run</span> : <span className="badge b-warn">{onboarding ? 'After deposit + eSocial' : 'After convert'}</span>}</td>
          </tr>
          <tr>
            <td>Local health (Oyster standard Brazil)</td>
            <td>{live ? <span className="badge b-ok">Enrol by 12 Sep</span> : <span className="badge b-info">{onboarding ? 'Quoted on invite' : 'Quoted'}</span>}</td>
          </tr>
          <tr>
            <td>Equity / refresh</td>
            <td><span className="badge b-info">Lumina plan · event must clear cut-off</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default function Person() {
  const { id } = useParams()
  const { notes, workers, launched, hires } = useApp()
  const live = workers.find((w) => w.id === id)
  const hire = (hires || []).find((w) => w.id === id)
  const base = allPeople().find((p) => p.id === id) || BRAZIL_CONTRACTORS.find((p) => p.id === id)
  const p = { ...(base || {}), ...(live || {}), ...(hire || {}) }
  if (!p?.name) {
    return (
      <div className="page">
        <p className="h1">Person not in this prototype slice</p>
        <Link to="/people">Back to People</Link>
      </div>
    )
  }
  const converted = p.status === 'converted' || (launched && p.id?.startsWith('br-') && !p.block && !p.hireKind)
  const type = converted ? 'eor' : p.type || 'contractor'
  const brazil = (p.country || 'Brazil') === 'Brazil' && !!p.invoice
  const isNewHire = p.hireKind === 'new'

  return (
    <div className="page">
      {notes && isNewHire && (
        <Presenter>
          Net-new hire, not a conversion. Same People record. Brazil means CLT via Oyster EOR — deposit still unpaid until Finance funds it.
        </Presenter>
      )}
      {notes && brazil && !isNewHire && (
        <Presenter>
          Same worker ID through PJ and CLT. Show the two eras, then HRIS write-back. That is the company story — not a new hire form.
        </Presenter>
      )}
      <p className="muted" style={{ marginBottom: 8 }}>
        <Link to="/people">People</Link> / {p.name} · {p.id}
      </p>
      <div className="row" style={{ marginBottom: 18 }}>
        <Avatar name={p.name} size="lg" />
        <div style={{ flex: 1 }}>
          <p className="h1" style={{ marginBottom: 4 }}>{p.name}</p>
          <p className="lede" style={{ margin: 0 }}>
            {p.role} · {p.city}, {p.country || 'Brazil'}
          </p>
        </div>
        <TypeBadge type={type} />
        <StatusBadge status={converted ? 'converted' : p.status} />
        {type === 'contractor' && p.country === 'Brazil' && (
          <Link to="/convert" className="btn btn-primary">Change employment state</Link>
        )}
        {type === 'eor' && p.status !== 'onboarding' && (
          <Link to="/lifecycle/offboard" className="btn btn-coral">Offboarding tab</Link>
        )}
      </div>
      <div className="grid grid-sidebar">
        <div>
          <div className="card">
            <p className="h2" style={{ marginBottom: 12 }}>Employment record</p>
            <dl className="kv">
              <dt>Worker ID</dt>
              <dd>{p.id}</dd>
              <dt>Hiring manager</dt>
              <dd>{p.manager || '—'}</dd>
              {p.email && (
                <>
                  <dt>Invite email</dt>
                  <dd>{p.email}</dd>
                </>
              )}
              <dt>First seen</dt>
              <dd>{p.start}</dd>
              <dt>Hours</dt>
              <dd>{p.hours ? `${p.hours}h / week` : 'Full time'}</dd>
              <dt>Exclusive</dt>
              <dd>{p.exclusive === undefined ? '—' : p.exclusive ? 'Yes' : 'No'}</dd>
              <dt>Company tools</dt>
              <dd>{p.tools ? 'Lumina SSO, GitHub, Slack' : '—'}</dd>
              {p.invoice && (
                <>
                  <dt>{converted ? 'Last PJ invoice' : 'Current invoice'}</dt>
                  <dd>
                    <Money value={p.invoice} /> / month
                  </dd>
                  <dt>Misclassification</dt>
                  <dd className="warn-text">{p.risk}/100 — {converted ? 'converted' : 'convert'}</dd>
                </>
              )}
            </dl>
            {p.note && <p className="note" style={{ marginTop: 16 }}>{p.note}</p>}
          </div>
          {brazil && <Eras p={p} converted={converted} />}
        </div>
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <p className="h2" style={{ marginBottom: 8 }}>{isNewHire ? 'EOR package' : converted ? 'On EOR' : 'If converted to EOR'}</p>
            {p.cltBase ? (
              <>
                <dl className="kv">
                  <dt>CLT base</dt>
                  <dd>
                    <Money value={p.cltBase} />
                  </dd>
                  <dt>Employer cost</dt>
                  <dd>
                    <Money value={p.employerCost} />
                  </dd>
                  <dt>Oyster EOR</dt>
                  <dd>USD {p.oysterFeeUsd}/mo</dd>
                </dl>
                <p className="muted" style={{ marginTop: 10 }}>Assumption: CLT total employer cost ≈ 1.75× base (13th, FGTS, vacation 1/3, INSS).</p>
              </>
            ) : (
              <p className="muted">{p.type === 'eor' || p.type === 'payroll' ? 'Package lives on the hire record.' : 'Already on EOR or payroll. No conversion pending.'}</p>
            )}
          </div>
          <Benefits converted={converted} country={p.country || 'Brazil'} onboarding={isNewHire} />
          <div className="card" style={{ marginBottom: 12 }}>
            <p className="h2" style={{ marginBottom: 8 }}>Internal context</p>
            <p className="muted">Support, Legal, and Country Experts see this same record. No Slack paste-back when something breaks.</p>
            <div style={{ marginTop: 10 }}>
              <Link to="/ops">
                <Btn variant="ghost" size="sm">View ops queue</Btn>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {brazil && <div style={{ marginTop: 12 }}><HrisStrip worker={p} /></div>}
    </div>
  )
}
