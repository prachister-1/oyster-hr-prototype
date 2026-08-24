import { Link } from 'react-router-dom'
import { COMPANY, OPS_TICKETS, WIZARD_STEPS } from '../data'
import { useApp } from '../state'
import { Avatar, Btn, Money, Presenter, StatusBadge } from '../components/ui'

export default function Convert() {
  const { notes, workers, setWorkers, wizard, setWizard, setLaunched, play, applyPlay } = useApp()
  const step = wizard
  const blocked = workers.filter((w) => w.block)
  const ready = workers.filter((w) => !w.block)
  const totalEmp = workers.reduce((s, w) => s + w.employerCost, 0)
  const fees = workers.length * 699

  function applyStatus(statusFor) {
    setWorkers((ws) => ws.map((w) => ({ ...w, status: statusFor(w) })))
  }

  function next() {
    if (step === 1) applyStatus((w) => (w.risk >= 80 ? 'in_review' : w.status))
    if (step === 3) applyStatus((w) => (w.block ? 'blocked' : 'contract_ready'))
    if (step === 5) applyStatus((w) => (w.block ? 'blocked' : 'awaiting_consent'))
    if (step === 6) applyStatus((w) => (w.block ? 'blocked' : 'payroll_setup'))
    if (step === 7) {
      applyStatus((w) => (w.block ? 'blocked' : 'converted'))
      setLaunched(true)
    }
    const nextStep = Math.min(7, step + 1)
    setWizard(nextStep)
    if (play >= 1 && play <= 8) applyPlay(play + 1)
  }

  return (
    <div className="page">
      {notes && (
        <Presenter>
          Walk all 8 steps if time. If not: Scope → Classify → Compensation → Exceptions → Launch. Say out loud where automation runs and where a human must touch.
        </Presenter>
      )}
      <p className="muted">
        <Link to="/compliance">Compliance</Link> / Contractor → EOR
      </p>
      <p className="h1">Convert 10 contractors in Brazil</p>
      <p className="lede">
        Regulatory deadline {COMPANY.deadline}. Product runs the happy path. Humans get a brief, not a blank ticket.
      </p>

      <div className="wizard">
        <div className="card wizard-nav">
          <div className="stepper">
            {WIZARD_STEPS.map((s) => (
              <button
                key={s.id}
                className={`step ${s.id < step ? 'done' : ''} ${s.id === step ? 'now' : ''}`}
                onClick={() => setWizard(s.id)}
                style={{ background: 'none', border: 0, textAlign: 'left', color: 'inherit', width: '100%' }}
              >
                <div className="n">{s.id < step ? '✓' : s.id + 1}</div>
                <div>
                  <div className="t">{s.title}</div>
                  <div className="s">{s.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {step === 0 && (
            <>
              <p className="h2">Scope the case</p>
              <p className="lede">Triggered by country-rule change, not a customer email. All 10 auto-enrolled.</p>
              {workers.map((w) => (
                <div className="check" key={w.id}>
                  <input type="checkbox" defaultChecked />
                  <Avatar name={w.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{w.name}</div>
                    <div className="muted">{w.role} · {w.city} · since {w.start}</div>
                  </div>
                  <StatusBadge status={w.status} />
                </div>
              ))}
            </>
          )}

          {step === 1 && (
            <>
              <p className="h2">Misclassification analyser</p>
              <p className="lede">Jurisdiction logic: hours, exclusivity, tools, subordination. Scores are prototype assumptions.</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Hours</th>
                    <th>Exclusive</th>
                    <th>Score</th>
                    <th>Call</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w.id}>
                      <td>{w.name}</td>
                      <td>{w.hours}</td>
                      <td>{w.exclusive ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="progress coral" style={{ width: 80, display: 'inline-block', marginRight: 8 }}>
                          <span style={{ width: `${w.risk}%` }} />
                        </div>
                        {w.risk}
                      </td>
                      <td className="warn-text">EOR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="note" style={{ marginTop: 12 }}>
                Automation: score + recommended type. Human: Gabriela (71) — Country Expert can still choose 32h CLT rather than full-time.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <p className="h2">Compensation map</p>
              <p className="lede">Keep take-home roughly whole. Show Finance the true employer cost before anyone signs.</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>PJ invoice</th>
                    <th>CLT base</th>
                    <th>Employer cost</th>
                    <th>EOR fee</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w.id}>
                      <td>{w.name}</td>
                      <td><Money value={w.invoice} /></td>
                      <td><Money value={w.cltBase} /></td>
                      <td><Money value={w.employerCost} /></td>
                      <td>USD {w.oysterFeeUsd}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>10 people</strong></td>
                    <td />
                    <td />
                    <td><strong><Money value={totalEmp} /></strong></td>
                    <td><strong>USD {fees}</strong></td>
                  </tr>
                </tbody>
              </table>
              <p className="note" style={{ marginTop: 12 }}>
                Assumption: CLT employer cost ≈ 1.75× base (13th salary, FGTS 8%, vacation 1/3, INSS). Security deposit = 1 month total employment cost, invoiced at launch. FX not modeled.
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <p className="h2">Exceptions — humans step in</p>
              <p className="lede">8 convert automatically. 2 open a structured brief. That is how product cuts ops load without going dark.</p>
              {OPS_TICKETS.map((t) => (
                <div className={`card ops-card ${t.team === 'Legal' ? 'legal' : t.team === 'Support' ? 'support' : 'expert'}`} key={t.id} style={{ padding: 0, marginBottom: 10 }}>
                  <div className="stripe" />
                  <div style={{ padding: 14 }}>
                    <div className="row">
                      <span className="badge b-info">{t.team}</span>
                      <strong>{t.title}</strong>
                      <span className="muted right">SLA {t.sla} · {t.owner}</span>
                    </div>
                    <p className="muted" style={{ margin: '8px 0 0' }}>{t.context}</p>
                    <p style={{ fontSize: 13, margin: '6px 0 0' }}><strong>Need: </strong>{t.need}</p>
                  </div>
                </div>
              ))}
              <Link to="/ops" className="btn btn-ghost btn-sm">Open full ops queue</Link>
            </>
          )}

          {step === 4 && (
            <>
              <p className="h2">CLT contracts</p>
              <p className="lede">Templates + required clauses (IP, confidentiality, termination). Non-standard terms are blocked — Oyster’s compliance-first stance.</p>
              {ready.map((w) => (
                <div className="check" key={w.id}>
                  <input type="checkbox" defaultChecked />
                  <div style={{ flex: 1 }}>
                    <strong>{w.name}</strong>
                    <div className="muted">CLT · {w.role} · São Paulo or remote Brazil · generated 22 Aug 2026</div>
                  </div>
                  <span className="badge b-ok">Ready to send</span>
                </div>
              ))}
              {blocked.map((w) => (
                <div className="check" key={w.id}>
                  <input type="checkbox" disabled />
                  <div style={{ flex: 1 }}>
                    <strong>{w.name}</strong>
                    <div className="muted">{w.block === 'ip' ? 'Waiting on IP novation' : 'Waiting on identity re-verify'}</div>
                  </div>
                  <span className="badge b-risk">Held</span>
                </div>
              ))}
            </>
          )}

          {step === 5 && (
            <>
              <p className="h2">Worker consent & documents</p>
              <p className="lede">Workers get a clear CLT offer, a take-home comparison, and a place to ask questions. Support sees the same thread.</p>
              {workers.map((w) => (
                <div className="check" key={w.id}>
                  <Avatar name={w.name} />
                  <div style={{ flex: 1 }}>
                    <strong>{w.name}</strong>
                    <div className="muted">Docs on file: {w.docs.join(', ')}{w.block === 'docs' ? ' · CPF failed checksum' : ''}</div>
                  </div>
                  <span className={`badge ${w.block ? 'b-risk' : 'b-warn'}`}>{w.block ? 'Blocked' : 'Consent queued'}</span>
                </div>
              ))}
            </>
          )}

          {step === 6 && (
            <>
              <p className="h2">Payroll lock</p>
              <p className="lede">First EOR cycle 30 Sep 2026. Contractor invoices stop 31 Aug. No double pay, no missed FGTS.</p>
              <dl className="kv">
                <dt>Last PJ payout</dt>
                <dd>5 Sep 2026 · pro-rata if needed</dd>
                <dt>First CLT payroll</dt>
                <dd>30 Sep 2026 · 8 ready + 2 if unblocked</dd>
                <dt>Pre-funding invoice</dt>
                <dd>Issued 16 Sep · net 7</dd>
                <dt>Security deposit</dt>
                <dd>1 month employer cost for converted seats</dd>
                <dt>HRIS sync</dt>
                <dd>Workday / HiBob pull — type flips Contractor → EOR</dd>
              </dl>
              <p className="note" style={{ marginTop: 14 }}>
                Automation: calendar, invoice draft, HRIS write. Human: Finance confirms deposit funding before go-live.
              </p>
            </>
          )}

          {step === 7 && (
            <>
              <p className="h2">Launch the conversion</p>
              <p className="lede">Year 1 product promise: a 30-day regulatory conversion that does not become a war room.</p>
              <div className="grid grid-3" style={{ margin: '12px 0 16px' }}>
                <div className="card stat">
                  <div className="k">Auto-convert</div>
                  <div className="v">8</div>
                </div>
                <div className="card stat">
                  <div className="k">Held for humans</div>
                  <div className="v">2</div>
                </div>
                <div className="card stat">
                  <div className="k">Days left</div>
                  <div className="v">{COMPANY.daysLeft}</div>
                </div>
              </div>
              <p className="note">
                After launch, Home, People, Payroll, and Ops all read the same case. That is the unified platform — not a new logo on three old apps.
              </p>
            </>
          )}

          <div className="row" style={{ marginTop: 18 }}>
            <Btn variant="ghost" disabled={step === 0} onClick={() => setWizard((s) => Math.max(0, s - 1))}>
              Back
            </Btn>
            {step < 7 ? (
              <Btn variant="primary" onClick={next}>
                Continue
              </Btn>
            ) : (
              <Btn
                variant="mint"
                onClick={() => {
                  applyStatus((w) => (w.block ? 'blocked' : 'converted'))
                  setLaunched(true)
                  applyPlay(9)
                }}
              >
                Launch conversion → EoR machine
              </Btn>
            )}
            <Link to="/conversion" className="btn btn-ghost">
              Command center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
