import { useApp } from '../state'
import { Btn, Presenter } from '../components/ui'

export default function Changes() {
  const { notes } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Compensation change: submit at least 3 business days before cut-off. FT ↔ PT: 10 business days. After cut-off, next cycle.
        </Presenter>
      )}
      <p className="muted">Pay · Payroll changes</p>
      <p className="h1">Bonus, allowance, salary</p>
      <p className="lede">One-time or monthly recurring. Local currency. Current month locks after the 15th (SE/CH/PH: 10th).</p>
      <div className="banner banner-info">
        <div>
          <h3>Ana Oliveira is now on the EoR calendar</h3>
          <p>Same Payroll changes form as Amelia in the UK. Type flipped. No new vendor.</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 520 }}>
        <label className="muted">Team member</label>
        <select className="chip" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 10px' }}>
          <option>Ana Oliveira · Brazil · EoR</option>
        </select>
        <label className="muted">Type</label>
        <select className="chip" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 10px' }}>
          <option>One-time bonus</option>
          <option>Monthly recurring</option>
          <option>Salary change (contract)</option>
        </select>
        <label className="muted">Amount</label>
        <input className="chip" placeholder="Local currency" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 14px' }} />
        <Btn variant="primary">Submit request</Btn>
      </div>
    </div>
  )
}
