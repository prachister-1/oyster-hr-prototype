import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state'
import { Btn, Presenter, StatusBadge } from '../components/ui'

function Progress() {
  const nav = useNavigate()
  const { notes, workers, hires, applyPlay } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          After launch, conversion is not a third product. The 10 land in Hiring progress like any EoR engagement. A net-new Brazil hire lands here too.
        </Presenter>
      )}
      <p className="muted">Hire · Hiring progress</p>
      <p className="h1">Engagements</p>
      <p className="lede">Draft → Assisted Setup → On Hold → Engaged → Terminated. New hires and conversions share this list.</p>
      {(hires || []).length > 0 && (
        <div className="banner banner-ok">
          <div>
            <h3>New hire in flight</h3>
            <p>{hires.map((h) => h.name).join(', ')} — invite sent. Deposit unpaid. Same stages as a converted contractor.</p>
          </div>
        </div>
      )}
      <div className="banner banner-info">
        <div>
          <h3>Brazil conversion is now employment setup</h3>
          <p>8 auto-convert seats in Assisted Setup. Diego (IP) and João (CPF) stay blocked with the same ops briefs.</p>
        </div>
      </div>
      <div className="card pad-0">
        <table className="table">
          <thead>
            <tr>
              <th>Team member</th>
              <th>Country</th>
              <th>Type</th>
              <th>Stage</th>
              <th>Blocker</th>
            </tr>
          </thead>
          <tbody>
            {(hires || []).map((h) => (
              <tr key={h.id} className="click" onClick={() => nav(`/people/${h.id}`)}>
                <td><strong>{h.name}</strong><div className="muted">New hire</div></td>
                <td>{h.country}</td>
                <td>{h.type === 'eor' ? 'EoR' : h.type}</td>
                <td><StatusBadge status="onboarding" /></td>
                <td className="muted">Deposit unpaid — agreements paused</td>
              </tr>
            ))}
            {workers.map((w) => (
              <tr
                key={w.id}
                className={w.id === 'br-01' ? 'click' : ''}
                onClick={() => w.id === 'br-01' && applyPlay(10)}
              >
                <td><strong>{w.name}</strong></td>
                <td>Brazil</td>
                <td>EoR</td>
                <td>
                  <StatusBadge
                    status={w.block ? 'blocked' : w.status === 'converted' ? 'onboarding' : w.status}
                  />
                </td>
                <td className="muted">
                  {w.block === 'ip' ? 'IP novation' : w.block === 'docs' ? 'CPF re-verify' : 'Deposit unpaid — agreements paused'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Setup() {
  const { notes, applyPlay } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Help Centre fact: no Direct Debit means the hire pauses until the deposit is confirmed. Agreements do not go out first.
        </Presenter>
      )}
      <p className="muted">Hiring progress · Ana Oliveira</p>
      <p className="h1">Assisted Setup</p>
      <p className="lede">Onboarding drafts the CLT pack. Signature waits on deposit.</p>
      <div className="banner banner-risk">
        <div>
          <h3>Hire paused — deposit unpaid</h3>
          <p>Agreements can only be shared after payment is confirmed. Direct Debit would have auto-triggered.</p>
        </div>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <p className="h2" style={{ marginBottom: 10 }}>Onboarding checklist</p>
          <table className="table">
            <tbody>
              <tr><td>Offer / conversion letter</td><td><StatusBadge status="converted" /></td></tr>
              <tr><td>Oyster intro + GDPR to Ana</td><td><StatusBadge status="converted" /></td></tr>
              <tr><td>Service Agreement (Lumina ↔ Oyster)</td><td><StatusBadge status="in_review" /></td></tr>
              <tr><td>Deposit invoice</td><td><StatusBadge status="blocked" /></td></tr>
              <tr><td>CLT + IP sent to Ana</td><td><StatusBadge status="draft" /></td></tr>
              <tr><td>Ana docs (ID, RTW, bank)</td><td><StatusBadge status="onboarding" /></td></tr>
            </tbody>
          </table>
          <div className="row" style={{ marginTop: 14 }}>
            <Btn variant="primary" onClick={() => applyPlay(13)}>Pay deposit</Btn>
            <Btn variant="ghost" onClick={() => applyPlay(11)}>View as Ana</Btn>
          </div>
        </div>
        <div className="card">
          <p className="h2" style={{ marginBottom: 8 }}>Cost on Service Agreement</p>
          <dl className="kv">
            <dt>CLT base</dt>
            <dd>BRL 12,500 / mo</dd>
            <dt>Employer cost</dt>
            <dd>BRL 21,840 / mo</dd>
            <dt>Oyster EoR fee</dt>
            <dd>USD 699 / mo</dd>
            <dt>Deposit</dt>
            <dd>Issued 2 weekdays after submit</dd>
          </dl>
          <p className="note" style={{ marginTop: 12 }}>
            Same numbers as Convert step 3. One record — not a new spreadsheet.
          </p>
        </div>
      </div>
    </div>
  )
}

function Deposit() {
  const { applyPlay } = useApp()
  return (
    <div className="page">
      <p className="muted">Pay · Invoices · Deposit</p>
      <p className="h1">Unlock agreements</p>
      <p className="lede">Deposit for Ana Oliveira. Cohort deposit for the other 7 ready seats sits on Invoices.</p>
      <div className="card">
        <dl className="kv">
          <dt>Invoice</dt>
          <dd>DEP-1842 · Ana Oliveira</dd>
          <dt>Issued</dt>
          <dd>2 weekdays after conversion submit</dd>
          <dt>Effect</dt>
          <dd>Unblocks Service Agreement + CLT send</dd>
        </dl>
        <div className="row" style={{ marginTop: 16 }}>
          <Btn variant="mint" onClick={() => applyPlay(14)}>Mark paid</Btn>
          <Btn variant="ghost" onClick={() => applyPlay(10)}>Back</Btn>
        </div>
      </div>
    </div>
  )
}

function Agreements() {
  const { applyPlay } = useApp()
  return (
    <div className="page">
      <p className="muted">Assisted Setup · Agreements</p>
      <p className="h1">Review and sign</p>
      <p className="lede">After admin + Team Member data are verified, both parties e-sign in the platform.</p>
      <div className="grid grid-3">
        <div className="card">
          <span className="badge b-ok">Company</span>
          <p className="h2" style={{ margin: '10px 0 6px' }}>Service Agreement</p>
          <p className="lede">Lumina ↔ Oyster. Terms + cost breakdown for Ana.</p>
          <Btn variant="primary">Sign as Lumina</Btn>
        </div>
        <div className="card">
          <span className="badge b-info">Team member</span>
          <p className="h2" style={{ margin: '10px 0 6px' }}>CLT employment contract</p>
          <p className="lede">Locally compliant. Sent after she accepts the draft.</p>
          <Btn variant="ghost" onClick={() => applyPlay(15)}>Wait for Ana</Btn>
        </div>
        <div className="card">
          <span className="badge b-warn">Optional</span>
          <p className="h2" style={{ margin: '10px 0 6px' }}>IP agreement</p>
          <p className="lede">Three-way. Diego’s novation is the exception path — not this pack.</p>
          <Btn variant="ghost">Include IP</Btn>
        </div>
      </div>
    </div>
  )
}

function Offboard() {
  const { notes } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Termination is a process, not a button. Country notice, cause, and severance sit with specialists. Do not promise a 48-hour exit.
        </Presenter>
      )}
      <p className="muted">Profile · Offboarding tab</p>
      <p className="h1">Request EoR offboarding</p>
      <p className="lede">
        Team → person → Offboarding → Request. Three-step form. Oyster runs final pay. After cut-off, next month.
      </p>
      <div className="banner banner-risk">
        <div>
          <h3>Ana Oliveira · Engaged</h3>
          <p>Oyster is the legal employer. Lumina still manages the work. Final payout: salary pro-rata, unused vacation, termination costs.</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 520 }}>
        <label className="muted">Last day</label>
        <input className="chip" type="date" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 12px' }} />
        <label className="muted">Reason / type</label>
        <select className="chip" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 12px' }}>
          <option>Resignation</option>
          <option>Termination</option>
          <option>End of contract</option>
        </select>
        <label className="muted">Notes for Country Expert / Legal</label>
        <textarea className="chip" rows={3} style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 14px' }} />
        <Btn variant="coral">Submit offboarding request</Btn>
      </div>
    </div>
  )
}

const VIEWS = { progress: Progress, setup: Setup, deposit: Deposit, agreements: Agreements, offboard: Offboard }

export default function Lifecycle() {
  const { view } = useParams()
  const Page = VIEWS[view] || Progress
  return <Page />
}
