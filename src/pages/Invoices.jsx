import { INVOICES } from '../data'
import { useApp } from '../state'
import { AiRec, StatusBadge } from '../components/ui'

export default function Invoices() {
  const { launched } = useApp()
  return (
    <div className="page">
      <p className="h1">Invoices</p>
      <p className="lede">Pre-funding and settlement. Deposit for Brazil conversion is held until launch.</p>
      <AiRec
        title={launched ? 'Deposit released for the 8 converted seats' : 'Fund the Brazil deposit or the 8 miss 30 Sep'}
        body="INV-2052 is the security deposit (1 month employment cost). Pre-funding INV-2041 is already paid. AI flags timing — it does not change invoice amounts."
        next={launched
          ? 'Settle remaining contractor payouts. Do not pay Diego or João as PJ after 21 Sep.'
          : 'Pay INV-2052 before launch. Pre-funding for September is due 16 Sep, net 7.'}
        human="Finance. Payroll if a cut-off is at risk."
        tags={['validation', 'next-best-action']}
      />
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
