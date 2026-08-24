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

export function AiRec({ title, body, next, human, tags, dark, onAccept, accepted }) {
  return (
    <aside className={`ai-rec ${dark ? 'ai-rec-dark' : ''}`}>
      <div className="ai-rec-top">
        <span className="ai-rec-k">AI recommendation</span>
        {tags?.length > 0 && (
          <span className="ai-tags">
            {tags.map((t) => (
              <em key={t}>{t}</em>
            ))}
          </span>
        )}
      </div>
      <strong>{title}</strong>
      {body && <p>{body}</p>}
      {next && (
        <p className="ai-next">
          <b>Next best action.</b> {next}
        </p>
      )}
      {human && (
        <p className="ai-human">
          <b>Human steps in.</b> {human}
        </p>
      )}
      {onAccept && (
        <button
          type="button"
          className={`btn btn-sm ${accepted ? 'btn-mint' : dark ? 'btn-ghost-light' : 'btn-ghost'}`}
          onClick={onAccept}
        >
          {accepted ? 'Recommendation accepted' : 'Accept recommendation'}
        </button>
      )}
    </aside>
  )
}
