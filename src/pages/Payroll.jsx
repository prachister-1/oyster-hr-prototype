import { PAYROLL_RUNS } from '../data'
import { useApp } from '../state'
import { AiRec, Presenter, StatusBadge } from '../components/ui'

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
      <AiRec
        title={launched
          ? '8 Brazil seats are on the 30 Sep EOR run. 2 are not.'
          : 'Lock 8 seats on 30 Sep. Do not pay Diego or João as PJ after 21 Sep.'}
        body="Last contractor payout 5 Sep. First CLT 30 Sep. AI checked cut-offs — it does not change statutory pay. Timing risk sits on the two exception seats."
        next={launched
          ? 'Payroll confirms the eight. Wave-2 CLT for Diego and João when briefs close.'
          : 'Finance funds the deposit. Payroll confirms the 15th cut-off before go-live.'}
        human="Payroll / Ops confirm dates. Finance if pre-funding is late."
        tags={['validation', 'risk flagging']}
      />
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
