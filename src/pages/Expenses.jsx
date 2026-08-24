import { StatusBadge } from '../components/ui'

export default function Expenses() {
  return (
    <div className="page">
      <p className="h1">Expenses</p>
      <p className="lede">EOR reimbursements via payroll. Receipt → approve → next cycle.</p>
      <div className="card pad-0">
        <table className="table">
          <thead>
            <tr>
              <th>Team member</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ana Oliveira</td>
              <td>Home office · Sep</td>
              <td>BRL 420</td>
              <td><StatusBadge status="in_review" /></td>
            </tr>
            <tr>
              <td>Amelia Ward</td>
              <td>Client dinner — London</td>
              <td>GBP 84</td>
              <td><StatusBadge status="in_review" /></td>
            </tr>
            <tr>
              <td>Lars Becker</td>
              <td>Train — Berlin offsite</td>
              <td>EUR 46</td>
              <td><StatusBadge status="funded" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
