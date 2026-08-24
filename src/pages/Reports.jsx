import { useApp } from '../state'
import { Presenter } from '../components/ui'

const METRICS = [
  { k: 'North star', v: 'Workforce NRR', d: 'Keep customers as they move Contractor → EOR → Payroll. Guardrail: gross margin per EOR seat.' },
  { k: 'Conversion', v: 'Case completion', d: '% of mandated conversions done before legal deadline. Target 95% without war-room staffing.' },
  { k: 'Speed', v: 'Time-to-hire', d: 'EOR median days. Brazil CLT conversion is a sibling metric: time-to-compliant-employment.' },
  { k: 'Ops load', v: 'Tickets / 100 workers', d: 'Must fall as automation rises. If tickets rise with NRR, the platform is leaking work to Support.' },
  { k: 'Quality', v: 'First payroll exception rate', d: 'After a conversion, wrong pay is the trust-killer. Guardrail on the happy path.' },
  { k: 'AI leverage', v: 'Minutes to brief', d: 'AI drafts Legal/Expert briefs from the worker record. Human still decides. Measure time-to-first-response.' },
]

export default function Reports() {
  const { notes } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Close the demo on metrics. NRR + deadline completion + ticket load. Revenue without platform health is Year-1 theater.
        </Presenter>
      )}
      <p className="h1">Reports</p>
      <p className="lede">What the incoming EOR product leader would put on the wall.</p>
      <div className="grid grid-3">
        {METRICS.map((m) => (
          <div className="card" key={m.k}>
            <div className="muted">{m.k}</div>
            <p className="h2" style={{ margin: '6px 0 8px' }}>{m.v}</p>
            <p className="muted" style={{ margin: 0, lineHeight: 1.45 }}>{m.d}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <p className="h2" style={{ marginBottom: 8 }}>AI — where it actually earns its keep</p>
        <div className="grid grid-2">
          <div>
            <p style={{ fontSize: 13.5, margin: '0 0 8px' }}><strong>Customer.</strong> Country-rule change explained in plain language. CLT vs PJ take-home in one view. Hire recommendation before a risky contractor is created.</p>
            <p style={{ fontSize: 13.5, margin: 0 }}><strong>Ops.</strong> Auto-brief for Legal / Country Expert / Support from the worker graph. Classification of incoming tickets so the 3 real exceptions are not buried in 40 “where is my contract?” pings.</p>
          </div>
          <div className="note">
            Do not use AI to invent employment terms. Contracts, tax, and payroll stay deterministic. AI drafts, routes, and explains. Humans sign and unblock.
          </div>
        </div>
      </div>
    </div>
  )
}
