import { INVOICES } from '../data'
import { StatusBadge } from '../components/ui'

export default function Invoices() {
  return (
    <div className="page">
      <p className="h1">Invoices</p>
      <p className="lede">Pre-funding and settlement. Deposit for the Brazil 10 is held until conversion launches.</p>
      <div className="card pad-0">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Type</th>
              <th>Due</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.type}</td>
                <td>{i.due}</td>
                <td>{i.amount}</td>
                <td><StatusBadge status={i.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
