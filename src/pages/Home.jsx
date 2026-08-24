import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allPeople, COUNTRIES, COUNTRY_GUIDES } from '../data'
import { countryAi } from '../ai'
import { useApp } from '../state'
import { Avatar, Presenter, TypeBadge, AiRec } from '../components/ui'

const VIEWS = [
  { id: 'overview', label: 'Overview' },
  { id: 'hire', label: 'Hire' },
  { id: 'mix', label: 'Engagement mix' },
  { id: 'attention', label: 'Needs review' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { notes, launched, workers, hires, setNotes, applyPlay, role } = useApp()
  const nav = useNavigate()
  const [view, setView] = useState('overview')
  const [mix, setMix] = useState('all')
  const [country, setCountry] = useState('United States')
  const [q, setQ] = useState('')
  const [checks, setChecks] = useState({ entity: true, analyser: true, cost: true, guide: false })

  const blocked = workers.filter((w) => w.block).length
  const converted = workers.filter((w) => w.status === 'converted').length
  const selected = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0]
  const guide = COUNTRY_GUIDES[country]
  const panelAi = countryAi(selected.name)
  const checklist = [
    {
      id: 'entity',
      label: 'Entity vs EOR decision logged',
      hint: guide?.entityOnFile
        ? `${country} entity is on file — own-entity payroll is available.`
        : `No ${country} entity on file — employment-like work goes EOR.`,
    },
    {
      id: 'analyser',
      label: 'Working pattern scored',
      hint: 'Hours, exclusivity, and tools decide contractor vs employment — before you send.',
    },
    {
      id: 'cost',
      label: 'True cost shared with Finance',
      hint: guide
        ? `Employer load in ${country} is about ${guide.costMultiple}× base (${guide.currency}).`
        : 'Share the country cost pack with Finance before the offer.',
    },
    {
      id: 'guide',
      label: 'Country guide reviewed',
      hint: guide ? `${country}: ${guide.employmentName}.` : 'Open the local employment pack.',
    },
  ]
  const people = useMemo(() => {
    const merged = allPeople().map((p) => {
      const live = workers.find((w) => w.id === p.id)
      return live ? { ...p, ...live, type: live.status === 'converted' ? 'eor' : p.type } : p
    })
    return [...(hires || []), ...merged]
  }, [workers, hires])

  const hits = useMemo(() => {
    if (!q.trim()) return []
    const s = q.toLowerCase()
    return people.filter((p) => `${p.name} ${p.role} ${p.country}`.toLowerCase().includes(s)).slice(0, 6)
  }, [q, people])

  const inCountry = people.filter((p) => p.country === country)
  const mixCounts = {
    eor: launched ? 50 : 42,
    contractor: launched ? 10 : 18,
    payroll: 12,
  }

  return (
    <div className="page home-page">
      <header className="home-hero">
        <div className="home-hero-top">
          <div>
            <p className="home-kicker">Lumina Labs · company admin</p>
            <h1 className="home-title">{greeting()}, Priya</h1>
            <p className="home-sub">One workforce. Contractors, EOR, and payroll on the same record.</p>
          </div>
          <div className="home-hero-tools">
            <label className="home-search">
              <span className="sr-only">Search the workforce</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search people or countries…"
                aria-label="Search people or countries"
              />
              {hits.length > 0 && (
                <ul className="home-suggest" role="listbox">
                  {hits.map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => nav(`/people/${p.id}`)}>
                        <Avatar name={p.name} />
                        <span>
                          <strong>{p.name}</strong>
                          <em>{p.role} · {p.country}</em>
                        </span>
                        <TypeBadge type={p.type} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </label>
            <div className="roles roles-hero">
              <button className={role === 'admin' ? 'on' : ''} onClick={() => applyPlay(0)} type="button">
                Admin
              </button>
              <button className={role === 'tm' ? 'on' : ''} onClick={() => applyPlay(11)} type="button">
                Team member
              </button>
            </div>
            <button className={`btn btn-sm ${notes ? 'btn-mint' : 'btn-ghost-light'}`} onClick={() => setNotes((v) => !v)} type="button">
              {notes ? 'Presenter on' : 'Notes'}
            </button>
          </div>
        </div>

        <div className="home-views" role="tablist" aria-label="Home views">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className={view === v.id ? 'on' : ''}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>

        {view === 'overview' && (
          <div className="home-actions">
            <button type="button" className="home-tile home-tile-primary" onClick={() => nav('/hire')}>
              <span className="home-tile-k">Start here</span>
              <strong>Hire in a country</strong>
              <p>Country first. Type is an output — payroll, EOR, or contractor.</p>
              <span className="home-tile-go">Open hire</span>
            </button>
            <button type="button" className="home-tile" onClick={() => nav('/people')}>
              <span className="home-tile-k">Directory</span>
              <strong>72 people</strong>
              <p>{mixCounts.eor} EOR · {mixCounts.contractor} contractors · {mixCounts.payroll} payroll</p>
              <span className="home-tile-go">Open People</span>
            </button>
            <button type="button" className="home-tile" onClick={() => nav('/finance')}>
              <span className="home-tile-k">Finance</span>
              <strong>Workforce P&amp;L</strong>
              <p>Three engagement types on one cost view</p>
              <span className="home-tile-go">Open P&amp;L</span>
            </button>
            <button type="button" className="home-tile" onClick={() => setView('attention')}>
              <span className="home-tile-k">Needs review</span>
              <strong>{mixCounts.contractor} contractors</strong>
              <p>Classification flags across the workforce — open a country to act.</p>
              <span className="home-tile-go">See flags</span>
            </button>
          </div>
        )}

        {view === 'hire' && (
          <div className="home-actions home-actions-3">
            <button type="button" className="home-tile home-tile-primary" onClick={() => nav('/hire')}>
              <span className="home-tile-k">Net-new</span>
              <strong>Hire someone</strong>
              <p>Pick the country they work in. Engagement type follows hours, exclusivity, and whether you have an entity.</p>
              <span className="home-tile-go">Start hire</span>
            </button>
            <button type="button" className="home-tile" onClick={() => nav('/people')}>
              <span className="home-tile-k">Existing</span>
              <strong>Find someone already on file</strong>
              <p>Same People record if their type later changes. Do not open a second profile.</p>
              <span className="home-tile-go">Open People</span>
            </button>
            {(hires || [])[0] ? (
              <button type="button" className="home-tile" onClick={() => nav(`/people/${hires[0].id}`)}>
                <span className="home-tile-k">In flight</span>
                <strong>{hires[0].name}</strong>
                <p>{hires[0].country} · invite sent</p>
                <span className="home-tile-go">Open record</span>
              </button>
            ) : (
              <div className="home-tile">
                <span className="home-tile-k">Checklist</span>
                <strong>{Object.values(checks).filter(Boolean).length}/4 ready</strong>
                <p>Country pack for {country} is below. Tick the last item before you send an offer.</p>
              </div>
            )}
          </div>
        )}

        {view === 'attention' && (
          <>
            <AiRec
              dark
              title="Convert 8 on the standard path. Route 2."
              body="Brazil PJ looks like employment: exclusive hours, Lumina managers, Lumina tools. AI would not re-contract. Gabriela (32h) needs Country Expert. Diego and João fail document gates later."
              next="Open conversion. Accept EOR for the eight. Do not start from a blank ticket."
              human="Legal, Country Expert, and Support only on exceptions."
              tags={['risk flagging', 'next-best-action', 'routing']}
            />
            <div className="home-actions home-actions-3">
            <button type="button" className="home-tile home-tile-alert" onClick={() => { setCountry('Brazil'); setView('overview') }}>
              <span className="home-tile-k">Brazil</span>
              <strong>10 PJ contractors flagged</strong>
              <p>Exclusive hours and Lumina tools. {blocked} need Legal or Country Expert if you convert.</p>
              <span className="home-tile-go">Open Brazil</span>
            </button>
            <button type="button" className="home-tile" onClick={() => nav('/ops')}>
              <span className="home-tile-k">Ops</span>
              <strong>3 tickets open</strong>
              <p>IP novation, identity re-check, hours question — not hire blockers for other countries.</p>
              <span className="home-tile-go">Ops queue</span>
            </button>
            <button type="button" className="home-tile" onClick={() => nav('/convert')}>
              <span className="home-tile-k">Convert</span>
              <strong>Contractor → employment</strong>
              <p>Same person, new legal type. Use when the analyser says convert, not re-contract.</p>
              <span className="home-tile-go">Conversion flow</span>
            </button>
          </div>
          </>
        )}

        {view === 'mix' && (
          <div className="home-mix">
            {[
              ['all', 72, 'All people'],
              ['eor', mixCounts.eor, 'EOR'],
              ['contractor', mixCounts.contractor, 'Contractors'],
              ['payroll', mixCounts.payroll, 'Own-entity payroll'],
            ].map(([id, n, label]) => (
              <button key={id} type="button" className={`mix-chip ${mix === id ? 'on' : ''}`} onClick={() => setMix(id)}>
                <b>{n}</b>
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="home-body">
        {notes && (
          <Presenter>
            Home opens on the whole workforce. Hire is the first action. Brazil conversion is under Needs review — not the default case.
          </Presenter>
        )}

        {launched && (
          <div className="banner banner-ok">
            <div>
              <h3>Brazil conversion launched — {converted}/10 now EOR</h3>
              <p>First CLT payroll locked for 30 Sep 2026. Two exceptions remain in the ops queue.</p>
            </div>
            <Link to="/conversion" className="btn btn-ghost">Command center</Link>
          </div>
        )}

        <div className="grid home-split">
          <div className="card">
            <div className="card-h">
              <p className="h2">Where the team sits</p>
              <span className="muted">Click a country</span>
            </div>
            <div className="heatmap">
              {COUNTRIES.map((c) => {
                const dim =
                  mix === 'eor' ? c.eor : mix === 'contractor' ? c.contractor : mix === 'payroll' ? c.payroll : c.total
                return (
                  <button
                    type="button"
                    className={`heat-row heat-btn ${country === c.name ? 'on' : ''}`}
                    key={c.name}
                    onClick={() => setCountry(c.name)}
                  >
                    <span>{c.name}</span>
                    <div className="bar mix">
                      <span style={{ width: `${Math.max(8, (dim / 16) * 100)}%` }} />
                    </div>
                    <strong>{dim}</strong>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="card country-panel">
              <div className="card-h">
                <p className="h2">{selected.name}</p>
                <span className="badge b-info">{selected.total} people</span>
              </div>
              <div className="mix-bars">
                <button type="button" className={mix === 'eor' ? 'on' : ''} onClick={() => setMix('eor')}>
                  <span>EOR</span>
                  <b>{selected.eor}</b>
                </button>
                <button type="button" className={mix === 'contractor' ? 'on' : ''} onClick={() => setMix('contractor')}>
                  <span>Contractor</span>
                  <b>{selected.contractor}</b>
                </button>
                <button type="button" className={mix === 'payroll' ? 'on' : ''} onClick={() => setMix('payroll')}>
                  <span>Payroll</span>
                  <b>{selected.payroll}</b>
                </button>
              </div>
              {panelAi && (
                <div style={{ marginTop: 12 }}>
                  <AiRec title={panelAi.title} body={panelAi.body} next={panelAi.next} human={panelAi.human} tags={panelAi.tags} />
                </div>
              )}
              <div className="country-people">
                {inCountry.slice(0, 5).map((p) => (
                  <button type="button" className="person-row" key={p.id} onClick={() => nav(`/people/${p.id}`)}>
                    <Avatar name={p.name} />
                    <span>
                      <strong>{p.name}</strong>
                      <em>{p.role}</em>
                    </span>
                    <TypeBadge type={p.type} />
                  </button>
                ))}
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <Link to="/hire" className="btn btn-primary btn-sm">Hire in {selected.name}</Link>
                {selected.name === 'Brazil' && (
                  <Link to="/convert" className="btn btn-ghost btn-sm">Convert contractors</Link>
                )}
                <Link to="/people" className="btn btn-ghost btn-sm">All people</Link>
              </div>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="card-h">
                <p className="h2">Before you hire</p>
                <span className="muted">{Object.values(checks).filter(Boolean).length}/4</span>
              </div>
              {checklist.map((t) => (
                <label className="check check-live" key={t.id}>
                  <input
                    type="checkbox"
                    checked={!!checks[t.id]}
                    onChange={() => setChecks((c) => ({ ...c, [t.id]: !c[t.id] }))}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{t.label}</div>
                    <div className="muted">{t.hint}</div>
                  </div>
                </label>
              ))}
              <div style={{ marginTop: 12 }}>
                <Link to="/hire" className="btn btn-mint btn-sm">Continue to hire</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
