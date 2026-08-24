import { StatusBadge } from '../components/ui'

export default function TimeOff() {
  return (
    <div className="page">
      <p className="h1">Time off</p>
      <p className="lede">Statutory rules per country. After Brazil converts, CLT vacation accrues automatically.</p>
      <div className="card pad-0">
        <table className="table">
          <thead>
            <tr>
              <th>Team member</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ana Oliveira</td>
              <td>Vacation · Brazil CLT</td>
              <td>2–3 Oct 2026</td>
              <td><StatusBadge status="in_review" /></td>
            </tr>
            <tr>
              <td>Sofia Almeida</td>
              <td>Annual leave · PT</td>
              <td>1–5 Sep 2026</td>
              <td><StatusBadge status="funded" /></td>
            </tr>
            <tr>
              <td>Kasia Nowak</td>
              <td>Onboarding hold</td>
              <td>—</td>
              <td><StatusBadge status="onboarding" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
