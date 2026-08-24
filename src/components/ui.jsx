import { colorFor, initials } from '../data'

export function Badge({ kind, children }) {
  return <span className={`badge b-${kind}`}>{children}</span>
}

export function Avatar({ name, size }) {
  return (
    <div className={`avatar ${size || ''}`} style={{ background: colorFor(name) }} title={name}>
      {initials(name)}
    </div>
  )
}

export function TypeBadge({ type }) {
  if (type === 'eor') return <Badge kind="eor">EOR</Badge>
  if (type === 'payroll') return <Badge kind="pay">Payroll</Badge>
  return <Badge kind="con">Contractor</Badge>
}

export function StatusBadge({ status }) {
  const map = {
    at_risk: ['risk', 'Must convert'],
    in_review: ['warn', 'In review'],
    contract_ready: ['info', 'Contract ready'],
    awaiting_consent: ['warn', 'Awaiting consent'],
    payroll_setup: ['info', 'Payroll setup'],
    converted: ['ok', 'Converted'],
    blocked: ['risk', 'Blocked'],
    active: ['ok', 'Active'],
    onboarding: ['warn', 'Onboarding'],
    funded: ['ok', 'Funded'],
    in_review_pay: ['warn', 'In review'],
    scheduled: ['info', 'Scheduled'],
    draft: ['info', 'Draft'],
    paid: ['ok', 'Paid'],
    open: ['warn', 'Open'],
    pending_conversion: ['risk', 'Tied to conversion'],
  }
  const [k, label] = map[status] || ['info', status]
  return <Badge kind={k}>{label}</Badge>
}

export function Btn({ variant = 'primary', size, children, ...rest }) {
  return (
    <button className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''}`} {...rest}>
      {children}
    </button>
  )
}

export function Money({ value, currency = 'BRL' }) {
  const n = Number(value).toLocaleString('en-US')
  return <span className="cost">{currency} {n}</span>
}

export function Presenter({ children }) {
  return (
    <div className="presenter">
      <b>Presenter note. </b>
      {children}
    </div>
  )
}
