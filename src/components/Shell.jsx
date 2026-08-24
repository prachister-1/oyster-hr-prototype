import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { COMPANY } from '../data'
import { FLOW } from '../flow'
import { useApp } from '../state'
import { Avatar } from './ui'

const I = {
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  ),
  hire: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
      <path d="M19 8v4M21 10h-4" />
    </svg>
  ),
  people: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.2 19a5 5 0 0 1 6.8-3.2" />
    </svg>
  ),
  payroll: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M8 15h3" />
    </svg>
  ),
  time: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
  exp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16v12H4z" />
      <path d="M8 7V5h8v2M9 12h6" />
    </svg>
  ),
  inv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3h8l5 5v13H7V3Z" />
      <path d="M15 3v5h5M10 13h6M10 17h4" />
    </svg>
  ),
  reports: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3Z" />
    </svg>
  ),
  ops: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M4.2 6.2l1.5 1.5M18.3 16.3l1.5 1.5M3 12h2M19 12h2M4.2 17.8l1.5-1.5M18.3 7.7l1.5-1.5" />
    </svg>
  ),
}

function Item({ to, icon, label, count }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')} end={to === '/'}>
      {icon}
      <span>{label}</span>
      {count ? <em className="count" aria-label={`${count} open`}>{count}</em> : null}
    </NavLink>
  )
}

function WalkBar() {
  const { play, applyPlay } = useApp()
  const f = FLOW[play] || FLOW[0]
  return (
    <nav className="walkbar" aria-label="Demo walkthrough">
      <button className="btn btn-ghost btn-sm" disabled={play <= 0} onClick={() => applyPlay(play - 1)}>
        Back
      </button>
      <div className="walk-mid">
        <b>
          {play + 1} / {FLOW.length}
        </b>
        {' · '}
        {f.title} · {f.who}
      </div>
      <button className="btn btn-mint btn-sm" disabled={play >= FLOW.length - 1} onClick={() => applyPlay(play + 1)}>
        {play >= FLOW.length - 1 ? 'Done' : 'Next'}
      </button>
    </nav>
  )
}

export default function Shell({ children, notes, setNotes }) {
  const loc = useLocation()
  const nav = useNavigate()
  const { role, applyPlay, setRole } = useApp()
  const convertActive = loc.pathname.startsWith('/convert') || loc.pathname.startsWith('/conversion')
  const who = role === 'tm' ? { name: 'Ana Oliveira', role: 'EoR Team Member · Brazil' } : COMPANY.admin
  const homeView = loc.pathname === '/' && role !== 'tm'
  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <aside className="sidebar" aria-label="Oyster">
        <div className="brand">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
            <circle cx="16" cy="16" r="12" fill="none" stroke="#5EFF83" strokeWidth="2.4" />
            <circle cx="16" cy="16" r="4" fill="#5EFF83" />
          </svg>
          <div>
            <div className="brand-name">Oyster</div>
            <div className="brand-sub">{role === 'tm' ? 'Your account' : COMPANY.name}</div>
          </div>
        </div>
        {role === 'tm' ? (
          <nav className="nav" aria-label="Team member">
            <div className="nav-label">Your account</div>
            <Item to="/me" icon={I.home} label="Home" />
            <Item to="/me/docs" icon={I.people} label="Onboarding docs" />
            <Item to="/me/sign" icon={I.shield} label="Agreements" />
            <Item to="/me/pay" icon={I.payroll} label="Payslips & time off" />
          </nav>
        ) : (
          <nav className="nav" aria-label="Company">
            <div className="nav-label">Workforce</div>
            <Item to="/" icon={I.home} label="Home" />
            <Item to="/hire" icon={I.hire} label="Hire" />
            <Item to="/people" icon={I.people} label="People" />
            <Item to="/compliance" icon={I.shield} label="Compliance" count={10} />
            <div className="nav-label">Pay</div>
            <Item to="/finance" icon={I.reports} label="Workforce P&L" />
            <Item to="/payroll" icon={I.payroll} label="Payroll" />
            <Item to="/invoices" icon={I.inv} label="Invoices" />
            <Item to="/changes" icon={I.payroll} label="Payroll changes" />
            <Item to="/expenses" icon={I.exp} label="Expenses" />
            <Item to="/time-off" icon={I.time} label="Time off" />
            <div className="nav-label">Operate</div>
            <Item to="/conversion" icon={I.shield} label="Conversions" count={convertActive ? 10 : 10} />
            <Item to="/ops" icon={I.ops} label="Ops queue" count={3} />
            <Item to="/reports" icon={I.reports} label="Reports" />
          </nav>
        )}
        <div className="sidebar-foot">
          <p className="muted" style={{ fontSize: 10, color: '#7aa8b6', margin: '0 0 10px', lineHeight: 1.4 }}>
            Interview prototype. Not Oyster production.
          </p>
          <div className="who">
            <Avatar name={who.name} />
            <div>
              <strong>{who.name}</strong>
              <div className="meta">{who.role}</div>
            </div>
          </div>
        </div>
      </aside>
      <div className={`main ${homeView ? 'main-home' : ''}`}>
        {!homeView && (
        <header className="topbar">
          <div className="search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <input type="search" placeholder="Search people, countries, invoices…" aria-label="Search people, countries, invoices" />
          </div>
          <div className="top-actions">
            <div className="roles">
              <button className={role === 'admin' ? 'on' : ''} onClick={() => { setRole('admin'); nav('/') }} type="button">
                Company admin
              </button>
              <button className={role === 'tm' ? 'on' : ''} onClick={() => { setRole('tm'); nav('/me') }} type="button">
                Team member
              </button>
            </div>
            <button className={`btn btn-ghost btn-sm ${notes ? 'btn-mint' : ''}`} onClick={() => setNotes((v) => !v)}>
              {notes ? 'Presenter on' : 'Presenter notes'}
            </button>
            <NavLink to="/compliance" className="btn btn-ghost btn-sm">
              10 at risk
            </NavLink>
          </div>
        </header>
        )}
        <main id="main">{children}</main>
        <WalkBar />
      </div>
    </div>
  )
}
