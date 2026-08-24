import { Link } from 'react-router-dom'
import { BRAZIL_CONTRACTORS } from '../data'
import { useApp } from '../state'
import { Money, Presenter, AiRec } from '../components/ui'

const MIX = {
  eor: { seats: 42, fee: 699, empCostUsd: 412880 },
  contractor: { seats: 18, fee: 29, empCostUsd: 74210 },
  payroll: { seats: 12, fee: 109, empCostUsd: 186420 },
}

export default function Finance() {
  const { notes, launched, workers } = useApp()
  const brReady = workers.filter((w) => !w.block)
  const brEmp = brReady.reduce((s, w) => s + w.employerCost, 0)
  const brFees = brReady.length * 699
  const eorSeats = launched ? MIX.eor.seats + brReady.length : MIX.eor.seats
  const conSeats = launched ? MIX.contractor.seats - brReady.length : MIX.contractor.seats
  const oysterFees = eorSeats * MIX.eor.fee + conSeats * MIX.contractor.fee + MIX.payroll.seats * MIX.payroll.fee
  const deposit = launched ? 0 : BRAZIL_CONTRACTORS.filter((w) => !w.block).length * 21840

  return (
    <div className="page">
      {notes && (
        <Presenter>
          This is the company view. Three engagement types, one P&amp;L. Rippling wins CFOs with fully-loaded cost. Say the assumptions out loud.
        </Presenter>
      )}
      <p className="muted">Finance · Workforce</p>
      <p className="h1">Workforce P&amp;L</p>
      <p className="lede">
        72 people. Fees to Oyster sit next to employment cost. Brazil conversion changes the mix — not the headcount.
      </p>
      <AiRec
        title={launched
          ? 'Mix shifted: 8 seats moved contractor → EOR. Headcount unchanged.'
          : 'Convert, do not terminate. Fund the deposit before 30 Sep.'}
        body="True employer cost on the 8 is ~1.75× CLT base plus USD 699. Terminating is cheaper on paper and loses the talent. Entity setup is slower than 30 days."
        next={launched
          ? 'Watch first CLT payroll exceptions. Diego and João are still not in the 8.'
          : 'Approve packages, fund INV-2052, launch the eight. Leave Diego and João on the exception path.'}
        human="Priya and Finance sign. AI does not change statutory load or invoice math."
        tags={['case summarisation', 'next-best-action']}
      />

      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        <div className="card stat">
          <div className="k">Seats</div>
          <div className="v">{eorSeats + conSeats + MIX.payroll.seats}</div>
          <div className="d">{eorSeats} EOR · {conSeats} contractor · {MIX.payroll.seats} payroll</div>
        </div>
        <div className="card stat">
          <div className="k">Oyster fees / mo</div>
          <div className="v">USD {oysterFees.toLocaleString('en-US')}</div>
          <div className="d">699 / 29 / 109 public list</div>
        </div>
        <div className="card stat">
          <div className="k">Employment + payouts</div>
          <div className="v">USD {(MIX.eor.empCostUsd + MIX.contractor.empCostUsd + MIX.payroll.empCostUsd).toLocaleString('en-US')}</div>
          <div className="d">August runs · mixed currency, shown USD</div>
        </div>
        <div className="card stat">
          <div className="k">Brazil deposit</div>
          <div className="v">{launched ? 'Unlocked' : 'Held'}</div>
          <div className="d">{launched ? '8 seats live on Sep EOR run' : 'Tied to conversion launch'}</div>
        </div>
      </div>

      <div className="card pad-0" style={{ marginBottom: 14 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Seats</th>
              <th>Oyster fee</th>
              <th>Fee / mo</th>
              <th>Pay / payouts (Aug)</th>
              <th>Legal employer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>EOR</strong></td>
              <td>{eorSeats}</td>
              <td>USD 699</td>
              <td>USD {(eorSeats * 699).toLocaleString('en-US')}</td>
              <td>USD {MIX.eor.empCostUsd.toLocaleString('en-US')}</td>
              <td>Oyster</td>
            </tr>
            <tr>
              <td><strong>Contractor</strong></td>
              <td>{conSeats}</td>
              <td>USD 29</td>
              <td>USD {(conSeats * 29).toLocaleString('en-US')}</td>
              <td>USD {MIX.contractor.empCostUsd.toLocaleString('en-US')}</td>
              <td>Worker (PJ / vendor)</td>
            </tr>
            <tr>
              <td><strong>Payroll (own entity)</strong></td>
              <td>{MIX.payroll.seats}</td>
              <td>USD 109</td>
              <td>USD {(MIX.payroll.seats * 109).toLocaleString('en-US')}</td>
              <td>USD {MIX.payroll.empCostUsd.toLocaleString('en-US')}</td>
              <td>Lumina US / UK</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <p className="h2" style={{ marginBottom: 8 }}>Brazil 8 — mix shift</p>
          <dl className="kv">
            <dt>Leave contractor</dt>
            <dd>USD {brReady.length * 29} / mo fees</dd>
            <dt>Join EOR</dt>
            <dd>USD {brFees.toLocaleString('en-US')} / mo fees</dd>
            <dt>CLT employer cost</dt>
            <dd>
              <Money value={brEmp} /> / mo · local
            </dd>
            <dt>First CLT cycle</dt>
            <dd>30 Sep 2026</dd>
          </dl>
          <p className="note" style={{ marginTop: 12 }}>
            Assumption: CLT employer cost ≈ 1.75× base. FX not modeled. Diego and João stay contractor until unblocked — they are not in these 8.
          </p>
          <div style={{ marginTop: 12 }}>
            <Link to="/conversion" className="btn btn-ghost btn-sm">Open conversion case</Link>
          </div>
        </div>
        <div className="card">
          <p className="h2" style={{ marginBottom: 8 }}>What Finance signs</p>
          <p className="lede">Same numbers as the Service Agreement and the convert quote. No second spreadsheet.</p>
          <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>Pre-funding invoice for EOR run</li>
            <li>Security deposit for new EOR seats</li>
            <li>Last PJ payout date locked</li>
            <li>No double pay after cut-off</li>
          </ul>
          {!launched && deposit > 0 && (
            <p className="note" style={{ marginTop: 12 }}>
              Deposit still held. Launch conversion to move 8 seats onto the September EOR calendar.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
