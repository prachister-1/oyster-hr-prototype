import { useParams } from 'react-router-dom'
import { useApp } from '../state'
import { AiRec, Btn, Presenter } from '../components/ui'

function Home() {
  const { notes, applyPlay } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          Worker view. She is not Lumina’s legal employee. Oyster is. Same conversion letter she saw in step 6.
        </Presenter>
      )}
      <p className="muted">Team Member · Home</p>
      <p className="h1">Welcome, Ana</p>
      <p className="lede">Oyster contacted you with how this works and a GDPR notice. Your engagement type is now EoR.</p>
      <AiRec
        title="You are becoming a CLT employee, not staying on a PJ invoice"
        body="Lumina still manages your day-to-day. Oyster is the legal employer in Brazil. This is the same conversion Priya launched — not a new job application."
        next="Upload only what is missing, then review the CLT. Ask questions in this thread before you sign."
        human="Support answers in-product. Country Expert if a clause is unclear."
        tags={['case summarisation']}
      />
      <div className="grid grid-3">
        <div className="card">
          <p className="h2">1. Your details & docs</p>
          <p className="lede">Address, tax ID, bank, ID, citizenship, right to work.</p>
          <Btn variant="primary" onClick={() => applyPlay(12)}>Continue</Btn>
        </div>
        <div className="card">
          <p className="h2">2. Agreements</p>
          <p className="lede">CLT contract after you are happy. Optional IP.</p>
          <Btn variant="ghost" onClick={() => applyPlay(15)}>Open</Btn>
        </div>
        <div className="card">
          <p className="h2">3. After Engaged</p>
          <p className="lede">Payslips, time off, expenses, documents.</p>
          <Btn variant="ghost" onClick={() => applyPlay(17)}>Preview</Btn>
        </div>
      </div>
    </div>
  )
}

function Docs() {
  const { applyPlay } = useApp()
  return (
    <div className="page">
      <p className="muted">Onboarding · Your information</p>
      <p className="h1">Documents Oyster needs to employ you</p>
      <AiRec
        title="Ask only for what is missing"
        body="RG, CPF, PIS, and bank are already on the Lumina contractor file. Do not re-upload those unless a check fails."
        next="Confirm address and bank. Add a current RG photo if the file is older than 12 months."
        human="Support if a scan is rejected. Country Expert if CPF fails checksum."
        tags={['missing-data detection', 'checklist generation']}
      />
      <div className="card" style={{ maxWidth: 520 }}>
        <label className="muted">Home address</label>
        <input className="chip" defaultValue="São Paulo" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 10px' }} />
        <label className="muted">CPF / PIS</label>
        <input className="chip" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 10px' }} />
        <label className="muted">Bank account</label>
        <input className="chip" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 10px' }} />
        <label className="muted">Government ID</label>
        <input className="chip" type="file" style={{ width: '100%', borderRadius: 8, padding: 10, margin: '4px 0 10px' }} />
        <Btn variant="primary" onClick={() => applyPlay(13)}>Submit to Oyster records</Btn>
      </div>
    </div>
  )
}

function Sign() {
  const { applyPlay } = useApp()
  return (
    <div className="page">
      <p className="muted">Agreements</p>
      <p className="h1">CLT employment contract · Brazil</p>
      <p className="lede">Review first. When you are happy, Oyster requests your signature. Statutory items are not negotiable here.</p>
      <AiRec
        title="Take-home is meant to stay roughly whole"
        body="Your PJ invoice was BRL 18,000 / month. CLT base is BRL 12,500, plus 13th salary, vacation + 1/3, and FGTS. INSS and tax still come out of the payslip — AI does not invent a net number."
        next="Read holiday, probation, and benefits. Sign if it matches the conversion offer. Request a change only on non-statutory items."
        human="Support if a clause looks wrong. Legal if you ask to edit the template."
        tags={['case summarisation']}
      />
      <div className="card">
        <p>Draft contract · salary BRL 12,500, holiday, probation, benefits as on the conversion offer.</p>
        <div className="row" style={{ marginTop: 14 }}>
          <Btn variant="mint" onClick={() => applyPlay(16)}>I’m happy — sign</Btn>
          <Btn variant="ghost">Request a change</Btn>
        </div>
      </div>
    </div>
  )
}

function Pay() {
  return (
    <div className="page">
      <p className="muted">After Engaged</p>
      <p className="h1">Your work tools</p>
      <div className="grid grid-3">
        <div className="card">
          <p className="h2">Payslips</p>
          <p className="lede">Gross to net, local currency, employer contributions. First CLT cycle 30 Sep 2026.</p>
        </div>
        <div className="card">
          <p className="h2">Time off</p>
          <p className="lede">Request vacation / sick. Flag a wrong balance to Lumina — they liaise with Oyster.</p>
        </div>
        <div className="card">
          <p className="h2">Expenses / time tracking</p>
          <p className="lede">Receipts in-app. Timesheets if country or employer requires.</p>
        </div>
      </div>
    </div>
  )
}

const VIEWS = { undefined: Home, docs: Docs, sign: Sign, pay: Pay }

export default function TeamMember() {
  const { view } = useParams()
  const Page = VIEWS[view] || Home
  return <Page />
}
