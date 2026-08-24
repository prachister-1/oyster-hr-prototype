import { PAYROLL_RUNS } from '../data'
import { useApp } from '../state'
import { Presenter, StatusBadge } from '../components/ui'

export default function Payroll() {
  const { notes, launched } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Payroll is still a product. The point: Brazil’s first CLT run already sits as a draft on the same calendar as EOR, own-entity, and contractor payouts.
        </Presenter>
      )}
      <p className="h1">Payroll</p>
      <p className="lede">One calendar for EOR, own-entity payroll, and contractor payouts.</p>
      <div className="card pad-0">
        <table className="table">
          <thead>
            <tr>
              <th>Cycle</th>
              <th>Pay date</th>
              <th>People</th>
              <th>Amount</th>
              <th>Exceptions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PAYROLL_RUNS.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.cycle}</strong>
                  {r.id === 'pr-4' && launched && <div className="muted">Includes 8 new Brazil EOR seats</div>}
                </td>
                <td>{r.date}</td>
                <td>{r.id === 'pr-4' && launched ? 50 : r.people}</td>
                <td>{r.amount}</td>
                <td>{r.exceptions}</td>
                <td>
                  <StatusBadge status={r.status === 'in_review' ? 'in_review' : r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
