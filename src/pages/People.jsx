import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allPeople } from '../data'
import { personAi } from '../ai'
import { useApp } from '../state'
import { AiRec, Avatar, Presenter, StatusBadge, TypeBadge } from '../components/ui'

export default function People() {
  const { notes, workers, hires } = useApp()
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const convertedPeople = allPeople().map((p) => {
      const live = workers.find((w) => w.id === p.id)
      return live ? { ...p, ...live, type: live.status === 'converted' ? 'eor' : p.type } : p
    })
    const merged = [...hires, ...convertedPeople]
    return merged.filter((p) => {
      const okTab = tab === 'all' || p.type === tab || (tab === 'risk' && p.country === 'Brazil' && p.type === 'contractor')
      const okQ = !q || `${p.name} ${p.role} ${p.country}`.toLowerCase().includes(q.toLowerCase())
      return okTab && okQ
    })
  }, [tab, q, workers, hires])

  return (
    <div className="page">
      {notes && (
        <Presenter>
          Same People table for contractors, EOR, and payroll. Engagement type is a filter, not a product hop.
        </Presenter>
      )}
      <p className="h1">People</p>
      <p className="lede">One worker record. Engagement type is an attribute, not a separate product silo.</p>
      {tab === 'risk' && (
        <AiRec
          title="10 Brazil PJ contractors look like employment"
          body="Exclusive hours, Lumina managers, Lumina tools. India contractors are a watch list — not a 30-day case yet."
          next="Open a person for the next-best-action on that record, or run the Brazil conversion."
          human="Country Expert only on Gabriela, João, and any India score that is ambiguous."
          tags={['risk flagging', 'next-best-action']}
        />
      )}
      <div className="tabs">
        {[
          ['all', 'All'],
          ['eor', 'EOR'],
          ['contractor', 'Contractors'],
          ['payroll', 'Payroll'],
          ['risk', 'At risk'],
        ].map(([id, label]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="filters">
        <input className="chip" style={{ minWidth: 220 }} placeholder="Filter by name or country" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="chip">{rows.length} shown</span>
      </div>
      <div className="card pad-0">
        <table className="table">
          <thead>
            <tr>
              <th>Team member</th>
              <th>Country</th>
              <th>Engagement</th>
              <th>Status</th>
              <th>AI</th>
              <th>Start</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const line = personAi(p, { converted: p.type === 'eor' && p.status === 'converted' })?.line
              return (
              <tr key={p.id} className="click" onClick={() => nav(`/people/${p.id}`)}>
                <td>
                  <div className="person">
                    <Avatar name={p.name} />
                    <div>
                      <div className="name">{p.name}</div>
                      <div className="sub">{p.role}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {p.country}
                  <div className="sub">{p.city}</div>
                </td>
                <td>
                  <TypeBadge type={p.type} />
                </td>
                <td>
                  <StatusBadge status={p.displayStatus || p.status} />
                </td>
                <td className="muted">{line || '—'}</td>
                <td>{p.start}</td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
