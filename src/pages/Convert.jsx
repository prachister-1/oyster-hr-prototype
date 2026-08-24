import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COMPANY, CONVERT_AI, FUTURE_STATE, OPS_TICKETS, WIZARD_STEPS } from '../data'
import { useApp } from '../state'
import { AiRec, Avatar, Btn, Money, Presenter, StatusBadge } from '../components/ui'

function futureOn(n, step) {
  if (step === 0) return n <= 2
  if (step === 1 || step === 2) return n === 3
  if (step >= 3 && step <= 5) return n === 4
  if (step === 6) return n === 5
  return n === 6
}

export default function Convert() {
  const { notes, workers, setWorkers, wizard, setWizard, setLaunched, play, applyPlay } = useApp()
  const [accepted, setAccepted] = useState({})
  const step = wizard
  const blocked = workers.filter((w) => w.block)
  const ready = workers.filter((w) => !w.block)
  const totalEmp = workers.reduce((s, w) => s + w.employerCost, 0)
  const fees = workers.length * 699
  const rec = CONVERT_AI[step]

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
    setWizard(Math.min(7, step + 1))
    if (play >= 1 && play <= 8) applyPlay(play + 1)
  }

  return (
    <div className="page">
      {notes && (
        <Presenter>
          This is the future-state conversion. AI drafts, flags, and routes. Humans get an exception package — not a blank ticket. Walk Trigger → Eligibility → Exceptions → Payroll if time is short.
        </Presenter>
      )}
      <p className="muted">
        <Link to="/compliance">Compliance</Link> / Contractor → EOR
      </p>
      <p className="h1">Convert 10 contractors in Brazil</p>
      <p className="lede">
        30-day regulatory conversion. Product runs the standard path. AI recommends. Humans only touch exceptions.
      </p>

      <div className="future-strip" aria-label="Future-state conversion">
        {FUTURE_STATE.map((f) => (
          <button
            key={f.n}
            type="button"
            className={futureOn(f.n, step) ? 'on' : ''}
            onClick={() => setWizard(f.wiz)}
          >
            <b>Step {f.n}</b>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

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
          <AiRec
            {...rec}
            accepted={!!accepted[step]}
            onAccept={() => setAccepted((a) => ({ ...a, [step]: true }))}
          />

          {step === 0 && (
            <>
              <p className="h2">Conversion trigger & intake</p>
              <p className="lede">Triggered by the country-rule feed, not a customer email. All 10 auto-enrolled into a shared workspace.</p>
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
              <p className="h2">Eligibility & risk</p>
              <p className="lede">Rules plus AI: hours, exclusivity, tools, subordination. Scores are prototype assumptions.</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Hours</th>
                    <th>Exclusive</th>
                    <th>Score</th>
                    <th>AI call</th>
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
                      <td className={w.risk < 80 ? 'warn-text' : 'ok-text'}>
                        {w.risk < 80 ? 'Expert review' : 'Convert · EOR'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {step === 2 && (
            <>
              <p className="h2">Compensation map</p>
              <p className="lede">Pre-filled from PJ invoices. Keep take-home roughly whole. Show Finance true employer cost before anyone signs.</p>
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
                Assumption: CLT employer cost ≈ 1.75× base (13th salary, FGTS 8%, vacation 1/3, INSS). Security deposit = 1 month total employment cost. FX not modeled. AI does not invent the statutory load.
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <p className="h2">Exceptions — humans get a package</p>
              <p className="lede">Complex eligibility → Country Expert. Document/legal → Legal + Country Expert. Timing/risk → Payroll + Legal.</p>
              {OPS_TICKETS.map((t) => (
                <div className={`card ops-card ${t.team === 'Legal' ? 'legal' : t.team === 'Support' ? 'support' : 'expert'}`} key={t.id} style={{ padding: 0, marginBottom: 10 }}>
                  <div className="stripe" />
                  <div style={{ padding: 14 }}>
                    <div className="row">
                      <span className="badge b-info">{t.team}</span>
                      <strong>{t.title}</strong>
                      <span className="muted right">SLA {t.sla} · {t.owner}</span>
                    </div>
                    <p className="muted" style={{ margin: '8px 0 0' }}>{t.route}</p>
                    <div className="pkg">
                      <p className="h3">Exception package</p>
                      <dl className="kv">
                        <dt>Worker</dt>
                        <dd>{t.worker}</dd>
                        <dt>Trigger</dt>
                        <dd>{t.trigger}</dd>
                        <dt>On file</dt>
                        <dd>{t.docs.join(', ')}</dd>
                        <dt>Missing</dt>
                        <dd>{t.missing.join(', ')}</dd>
                        <dt>Risk</dt>
                        <dd>{t.risk}</dd>
                        <dt>Recommended</dt>
                        <dd>{t.recommended}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/ops" className="btn btn-ghost btn-sm">Open full ops queue</Link>
            </>
          )}

          {step === 4 && (
            <>
              <p className="h2">Guided contracts</p>
              <p className="lede">Standard path stays on the template. Ambiguous cases wait for expert review — Oyster does not invent clauses.</p>
              {ready.map((w) => (
                <div className="check" key={w.id}>
                  <input type="checkbox" defaultChecked />
                  <div style={{ flex: 1 }}>
                    <strong>{w.name}</strong>
                    <div className="muted">CLT · {w.role} · São Paulo or remote Brazil · generated 22 Aug 2026</div>
                  </div>
                  <span className="badge b-ok">Standard path</span>
                </div>
              ))}
              {blocked.map((w) => (
                <div className="check" key={w.id}>
                  <input type="checkbox" disabled />
                  <div style={{ flex: 1 }}>
                    <strong>{w.name}</strong>
                    <div className="muted">{w.block === 'ip' ? 'Expert path — IP novation' : 'Expert path — identity re-verify'}</div>
                  </div>
                  <span className="badge b-risk">Held</span>
                </div>
              ))}
            </>
          )}

          {step === 5 && (
            <>
              <p className="h2">Worker consent — only what’s missing</p>
              <p className="lede">Smart checklist. AI does not re-ask for documents already on file.</p>
              {workers.map((w) => {
                const missing = w.block === 'docs' ? ['Current RG', 'CPF checksum'] : w.block === 'ip' ? ['IP novation letter'] : []
                return (
                  <div className="check" key={w.id}>
                    <Avatar name={w.name} />
                    <div style={{ flex: 1 }}>
                      <strong>{w.name}</strong>
                      <div className="muted">
                        On file: {w.docs.join(', ')}
                        {missing.length ? ` · Ask for: ${missing.join(', ')}` : ' · Ready to e-sign'}
                      </div>
                    </div>
                    <span className={`badge ${missing.length ? 'b-risk' : 'b-warn'}`}>
                      {missing.length ? 'Missing items' : 'Consent queued'}
                    </span>
                  </div>
                )
              })}
            </>
          )}

          {step === 6 && (
            <>
              <p className="h2">Payroll readiness</p>
              <p className="lede">AI validates cut-offs and dates, then flags timing risk. Payroll still confirms before lock.</p>
              <div className="banner banner-risk">
                <div className="pulse" />
                <div>
                  <h3>Timing risk on 2 seats</h3>
                  <p>Diego and João will miss 30 Sep if still blocked. Do not pay them as PJ after 21 Sep. Wave-2 CLT, not a silent contractor month.</p>
                </div>
              </div>
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
            </>
          )}

          {step === 7 && (
            <>
              <p className="h2">EOR activation & close-out</p>
              <p className="lede">Confirm activation, update the same People records, close the loop. Year 1 promise: 30 days without a war room.</p>
              <div className="grid grid-3" style={{ margin: '12px 0 16px' }}>
                <div className="card stat">
                  <div className="k">Straight-through</div>
                  <div className="v">8</div>
                </div>
                <div className="card stat">
                  <div className="k">Exception path</div>
                  <div className="v">2</div>
                </div>
                <div className="card stat">
                  <div className="k">Days left</div>
                  <div className="v">{COMPANY.daysLeft}</div>
                </div>
              </div>
              <p className="note">
                After launch, Home, People, Payroll, and Ops read the same case. AI does not invent employment terms. It drafts, routes, and explains. Humans sign and unblock.
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
