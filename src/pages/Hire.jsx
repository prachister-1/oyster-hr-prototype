import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COUNTRY_GUIDES, HIRE_STEPS } from '../data'
import { useApp } from '../state'
import { Btn, Money, Presenter, AiRec } from '../components/ui'

const COUNTRIES = Object.keys(COUNTRY_GUIDES)

function recommend({ country, hours, exclusive, tools }) {
  const g = COUNTRY_GUIDES[country]
  const employmentLike = hours >= 30 && (exclusive || tools)
  if (employmentLike && g.entityOnFile) {
    return {
      id: 'payroll',
      title: 'Hire onto own-entity payroll',
      why: `${country} entity is on file. Exclusive ${hours}h work is employment — do not open a contractor aisle.`,
      fee: `USD ${g.feePayroll} / month`,
      next: `Continue with ${g.legalEmployer} as legal employer.`,
      human: `${g.expert} only if right-to-work fails.`,
      tags: ['risk flagging', 'routing'],
    }
  }
  if (employmentLike) {
    return {
      id: 'eor',
      title: 'Hire via Employer of Record',
      why: `No ${country} entity on file. Hours, exclusivity, and tools score as employment. Contractor onboarding is blocked.`,
      fee: `USD ${g.feeEor} / month`,
      next: `Continue as ${g.employmentName}.`,
      human: `${g.expert} reviews KYC if docs fail.`,
      tags: ['risk flagging', 'routing'],
    }
  }
  return {
    id: 'contractor',
    title: 'Contractor may be defensible',
    why: 'Lower hours and non-exclusive work. Still run eligibility before sending a contract.',
    fee: 'USD 29 / month',
    next: 'Continue as contractor, with a conversion path if hours later look like employment.',
    human: 'Country expert if the analyser later flips this to employment.',
    tags: ['risk flagging'],
  }
}

function Field({ label, children }) {
  return (
    <label>
      <div className="field-label">{label}</div>
      {children}
    </label>
  )
}

export default function Hire() {
  const { notes, hires, setHires } = useApp()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [country, setCountry] = useState('United States')
  const [hours, setHours] = useState(40)
  const [exclusive, setExclusive] = useState(true)
  const [tools, setTools] = useState(true)
  const [name, setName] = useState('Jordan Hale')
  const [email, setEmail] = useState('jordan.hale@gmail.com')
  const [role, setRole] = useState('Software Engineer')
  const [city, setCity] = useState('Austin')
  const [start, setStart] = useState('2026-09-15')
  const [manager, setManager] = useState('Noah Kim')
  const [base, setBase] = useState(145000)
  const [created, setCreated] = useState(null)

  const g = COUNTRY_GUIDES[country]
  const rec = recommend({ country, hours, exclusive, tools })
  const employerCost = Math.round(base * g.costMultiple)
  const deposit = employerCost
  const oysterFee = rec.id === 'payroll' ? g.feePayroll : rec.id === 'eor' ? g.feeEor : 29

  const draft = useMemo(
    () => ({
      id: created?.id || `hire-${country.slice(0, 2).toLowerCase()}-${String(hires.length + 1).padStart(2, '0')}`,
      name,
      email,
      role,
      country,
      city,
      type: rec.id === 'contractor' ? 'contractor' : rec.id === 'payroll' ? 'payroll' : 'eor',
      status: 'onboarding',
      start: start.replace(/(\d{4})-(\d{2})-(\d{2})/, (_, y, m, d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${Number(d)} ${months[Number(m) - 1]} ${y}`
      }),
      manager,
      hours,
      exclusive,
      tools,
      cltBase: rec.id === 'contractor' ? null : base,
      employerCost: rec.id === 'contractor' ? null : employerCost,
      oysterFeeUsd: oysterFee,
      hireKind: 'new',
      currency: g.currency,
      note: `New ${rec.id === 'eor' ? 'EOR' : rec.id} hire in ${country}. Legal employer: ${g.legalEmployer}.`,
    }),
    [name, email, role, country, city, start, manager, hours, exclusive, tools, rec.id, base, employerCost, oysterFee, g, hires.length, created],
  )

  function onCountry(c) {
    const next = COUNTRY_GUIDES[c]
    setCountry(c)
    setCity(next.defaultCity)
    setBase(next.defaultBase)
  }

  function sendInvite() {
    const person = { ...draft, id: `hire-${Date.now().toString().slice(-6)}` }
    setHires((list) => [person, ...list])
    setCreated(person)
    setStep(5)
  }

  return (
    <div className="page">
      {notes && (
        <Presenter>
          Net-new hire. Country first — US with an entity lands on payroll; a country with no entity lands on EOR. Conversion of existing contractors is a different journey.
        </Presenter>
      )}
      <p className="h1">Hire someone</p>
      <p className="lede">Pick the country first. Engagement type is an output of hours, exclusivity, and whether you have an entity there.</p>

      <div className="wizard">
        <div className="card wizard-nav">
          <div className="stepper">
            {HIRE_STEPS.map((s) => (
              <button
                key={s.id}
                className={`step ${s.id < step ? 'done' : ''} ${s.id === step ? 'now' : ''}`}
                onClick={() => s.id <= step && setStep(s.id)}
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
          <p className="muted" style={{ marginTop: 12 }}>
            Converting people already on file? <Link to="/convert">Open conversion.</Link>
          </p>
        </div>

        <div className="card">
          {step === 0 && (
            <>
              <p className="h2">Where will they work?</p>
              <p className="lede">Country, hours, and working pattern decide EOR vs own-entity payroll vs contractor.</p>
              <div className="grid" style={{ gap: 12, maxWidth: 520 }}>
                <Field label="Country">
                  <select className="field" value={country} onChange={(e) => onCountry(e.target.value)}>
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Job title">
                  <input className="field" value={role} onChange={(e) => setRole(e.target.value)} />
                </Field>
                <Field label={`Hours / week · ${hours}`}>
                  <input type="range" min="10" max="40" value={hours} onChange={(e) => setHours(+e.target.value)} style={{ width: '100%' }} />
                </Field>
                <label className="row">
                  <input type="checkbox" checked={exclusive} onChange={(e) => setExclusive(e.target.checked)} />
                  Exclusive to Lumina
                </label>
                <label className="row">
                  <input type="checkbox" checked={tools} onChange={(e) => setTools(e.target.checked)} />
                  Uses Lumina tools / reports to a Lumina manager
                </label>
              </div>
              <div style={{ marginTop: 16 }}>
              <AiRec
                title={rec.title}
                body={rec.why}
                next={rec.next}
                human={rec.human}
                tags={rec.tags}
              />
              </div>
              {g.crackdown && rec.id === 'eor' && <p className="note" style={{ marginTop: 12 }}>{g.crackdown}</p>}
              <dl className="kv" style={{ marginTop: 12 }}>
                <dt>Entity in {country}?</dt>
                <dd>{g.entityOnFile ? 'Yes — Lumina' : 'No — EOR if this is employment'}</dd>
                <dt>Legal employer</dt>
                <dd>{rec.id === 'contractor' ? 'Worker’s own company' : g.legalEmployer}</dd>
                <dt>Oyster fee</dt>
                <dd>{rec.fee}</dd>
              </dl>
            </>
          )}

          {step === 1 && (
            <>
              <p className="h2">Candidate</p>
              <p className="lede">Personal email for the invite. They do not need a Lumina inbox yet.</p>
              <div className="grid grid-2">
                <Field label="Full name">
                  <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Personal email">
                  <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field label="City">
                  <input className="field" value={city} onChange={(e) => setCity(e.target.value)} />
                </Field>
                <Field label="Start date">
                  <input className="field" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                </Field>
                <Field label="Hiring manager">
                  <input className="field" value={manager} onChange={(e) => setManager(e.target.value)} />
                </Field>
                <Field label="Job title">
                  <input className="field" value={role} onChange={(e) => setRole(e.target.value)} />
                </Field>
              </div>
              <p className="note" style={{ marginTop: 14 }}>
                {country === 'Brazil'
                  ? 'Brazil: worker must have CPF. Country Expert Marina Costa reviews KYC before the CLT goes out.'
                  : `Country expert: ${g.expert}.`}
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <p className="h2">{g.employmentName}</p>
              <p className="lede">
                {rec.id === 'contractor'
                  ? 'Contractor terms. Analyser still runs at send.'
                  : 'These are statutory. You do not negotiate them away in this product.'}
              </p>
              {rec.id === 'contractor' ? (
                <div className="banner banner-risk">
                  <div>
                    <h3>Contractor is allowed on this pattern only</h3>
                    <p>If hours or exclusivity change later, this record should convert — same person, new legal type. Do not create a second profile.</p>
                  </div>
                </div>
              ) : (
                <dl className="kv">
                  <dt>Legal employer</dt>
                  <dd>{g.legalEmployer}</dd>
                  <dt>Time to hire</dt>
                  <dd>{g.timeToHire}</dd>
                  <dt>Probation</dt>
                  <dd>{g.probation}</dd>
                  <dt>Notice</dt>
                  <dd>{g.notice}</dd>
                  <dt>Vacation</dt>
                  <dd>{g.vacation}</dd>
                  <dt>13th / extra pay</dt>
                  <dd>{g.thirteenth}</dd>
                </dl>
              )}
              <p className="h2" style={{ margin: '16px 0 8px' }}>Statutory load</p>
              <div className="row">
                {g.statutory.map((s) => (
                  <span className="chip" key={s}>{s}</span>
                ))}
              </div>
              {country === 'Brazil' && rec.id === 'eor' && (
                <p className="note" style={{ marginTop: 14 }}>
                  Oyster registers the hire on eSocial, opens FGTS, and issues the CLT. Lumina keeps day-to-day management. Terminations must go through Oyster.
                </p>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <p className="h2">Compensation</p>
              <p className="lede">
                {rec.id === 'contractor'
                  ? 'Monthly invoice. No 13th, FGTS, or vacation accrual.'
                  : `Gross ${g.currency}. Employer cost uses a ${g.costMultiple}× statutory load — prototype assumption.`}
              </p>
              <div className="grid grid-2">
                <div>
                  <Field label={rec.id === 'contractor' ? `Monthly invoice (${g.currency})` : `Base salary (${g.currency})`}>
                    <input className="field" type="number" value={base} onChange={(e) => setBase(+e.target.value || 0)} />
                  </Field>
                  {country === 'Brazil' && rec.id === 'eor' && (
                    <p className="muted" style={{ marginTop: 8 }}>
                      Salary insights: senior engineers in São Paulo often land BRL 12–16k CLT base. This offer sits in band.
                    </p>
                  )}
                </div>
                <div className="card" style={{ background: 'var(--paper)' }}>
                  <dl className="kv">
                    <dt>{rec.id === 'contractor' ? 'Invoice' : 'Base'}</dt>
                    <dd><Money value={base} currency={g.currency} /></dd>
                    {rec.id !== 'contractor' && (
                      <>
                        <dt>Employer cost</dt>
                        <dd><Money value={employerCost} currency={g.currency} /></dd>
                        <dt>Security deposit</dt>
                        <dd>1 month · <Money value={deposit} currency={g.currency} /></dd>
                      </>
                    )}
                    <dt>Oyster fee</dt>
                    <dd>USD {oysterFee} / mo</dd>
                    <dt>First payroll</dt>
                    <dd>{rec.id === 'contractor' ? 'Next contractor cycle' : '30 Sep 2026 if start is mid-Sep'}</dd>
                  </dl>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="h2">Setup before the contract goes out</p>
              <p className="lede">Same machine as a conversion: docs, deposit, then signature. Agreements do not go first.</p>
              <div className="grid grid-2">
                <div className="card" style={{ background: 'var(--paper)' }}>
                  <p className="h2" style={{ marginBottom: 8 }}>Worker uploads</p>
                  {g.docs.map((d) => (
                    <div className="check" key={d}>
                      <input type="checkbox" disabled />
                      <div>{d}</div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ background: 'var(--paper)' }}>
                  <p className="h2" style={{ marginBottom: 8 }}>Benefits pack</p>
                  {g.benefits.map((b) => (
                    <div className="check" key={b.name}>
                      <input type="checkbox" defaultChecked={b.included} readOnly />
                      <div>
                        {b.name}
                        {b.amount ? <div className="muted">{g.currency} {b.amount}{country === 'Portugal' ? ' / day' : ' / mo'}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="timeline" style={{ marginTop: 16 }}>
                <div className="tl">
                  <div className="dot auto" />
                  <div>
                    <h4>Automation</h4>
                    <p>Invite, analyser, country template, payroll calendar, HRIS draft row.</p>
                  </div>
                </div>
                <div className="tl">
                  <div className="dot human" />
                  <div>
                    <h4>Country Expert · {g.expert}</h4>
                    <p>{country === 'Brazil' ? 'CPF / PIS check, eSocial, CLT clauses. Steps in only if KYC fails.' : 'Local pack and right-to-work. Silent if clean.'}</p>
                  </div>
                </div>
                <div className="tl">
                  <div className="dot human" />
                  <div>
                    <h4>You (Priya)</h4>
                    <p>Approve cost, fund 1-month deposit, name the manager. Then the worker can sign.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 5 && created && (
            <>
              <div className="banner banner-ok">
                <div>
                  <h3>Invite sent to {created.name}</h3>
                  <p>
                    {created.email} · {created.country} · {created.type === 'eor' ? 'EOR' : created.type}. They appear in People as onboarding. Deposit still unpaid — contract waits.
                  </p>
                </div>
              </div>
              <dl className="kv">
                <dt>Worker ID</dt>
                <dd>{created.id}</dd>
                <dt>Role</dt>
                <dd>{created.role} · {created.city}</dd>
                <dt>Start</dt>
                <dd>{created.start}</dd>
                <dt>Legal employer</dt>
                <dd>{g.legalEmployer}</dd>
                {created.cltBase && (
                  <>
                    <dt>Base / employer cost</dt>
                    <dd>
                      <Money value={created.cltBase} currency={g.currency} /> · <Money value={created.employerCost} currency={g.currency} />
                    </dd>
                  </>
                )}
              </dl>
              <div className="row" style={{ marginTop: 16 }}>
                <Btn variant="primary" onClick={() => nav(`/people/${created.id}`)}>Open their record</Btn>
                <Btn variant="ghost" onClick={() => nav('/people')}>People</Btn>
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setCreated(null)
                    setStep(0)
                    setName('')
                    setEmail('')
                  }}
                >
                  Hire another
                </Btn>
              </div>
            </>
          )}

          {step < 5 && (
            <div className="row" style={{ marginTop: 18 }}>
              <Btn variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                Back
              </Btn>
              {step < 4 ? (
                <Btn variant="primary" onClick={() => setStep((s) => s + 1)}>
                  Continue
                </Btn>
              ) : (
                <Btn variant="mint" onClick={sendInvite}>
                  Send invite
                </Btn>
              )}
              {rec.id === 'eor' && step === 0 && (
                <span className="muted">Next: candidate details for {country}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
