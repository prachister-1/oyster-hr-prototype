import { useApp } from '../state'

export default function HrisStrip({ worker, compact }) {
  const { launched } = useApp()
  const type = worker?.status === 'converted' ? 'EOR' : worker?.type === 'eor' ? 'EOR' : worker?.type === 'payroll' ? 'Payroll' : 'Contractor'
  const flip = launched && worker?.id?.startsWith('br-') && !worker?.block
  return (
    <div className={compact ? '' : 'card'} style={compact ? undefined : { marginBottom: 12 }}>
      <p className="h2" style={{ marginBottom: 8 }}>HRIS write-back</p>
      <p className="muted" style={{ marginBottom: 10 }}>
        Type lives on one worker ID. Workday / HiBob / Personio receive the flip — they do not get a new person.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>System</th>
            <th>Object</th>
            <th>Last write</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Workday</td>
            <td>{worker ? `${worker.name} · ${worker.id}` : 'Workforce sync'}</td>
            <td>{flip ? 'Queued 22 Aug 16:40' : '21 Aug 22:10'}</td>
            <td>{flip ? `Contractor → ${type}` : type}</td>
          </tr>
          <tr>
            <td>HiBob</td>
            <td>Employment type + start</td>
            <td>{flip ? 'Queued' : '21 Aug 22:10'}</td>
            <td>{flip ? 'Waiting first CLT cycle' : 'In sync'}</td>
          </tr>
          <tr>
            <td>Personio</td>
            <td>Draft offboarding / hire</td>
            <td>—</td>
            <td>Idle · unused drafts die in 10 days</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
