import { FLOW, LANES } from '../flow'
import { useApp } from '../state'
import { Btn, Presenter } from '../components/ui'

export default function Flow() {
  const { notes, play, applyPlay } = useApp()
  return (
    <div className="page">
      {notes && (
        <Presenter>
          One story. Convert the 10, then walk Ana Oliveira through the real EoR path — deposit, sign, payroll, offboard. Employment type is a state, not a product line.
        </Presenter>
      )}
      <p className="muted">Interview case · not the live tenant</p>
      <p className="h1">One hire, every workflow</p>
      <p className="lede">
        Contractor conversion plus the Help Centre EoR lifecycle. Next flips admin and Ana automatically.
      </p>
      <div className="row" style={{ marginBottom: 18 }}>
        <Btn variant="mint" onClick={() => applyPlay(1)}>
          Play full flow
        </Btn>
        <Btn variant="ghost" onClick={() => applyPlay(9)}>
          Skip to EoR machine
        </Btn>
      </div>
      {LANES.map((lane) => (
        <div key={lane.id} className="flow-block">
          <p className="muted" style={{ fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {lane.label}
          </p>
          <div className="flow-lane">
            {FLOW.slice(lane.from, lane.to).map((f, i) => {
              const n = lane.from + i
              return (
                <button
                  key={n}
                  className={`flow-box ${play === n ? 'now' : ''}`}
                  onClick={() => applyPlay(n)}
                  type="button"
                >
                  <b>{f.title}</b>
                  <small>{f.who}</small>
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <p className="muted" style={{ marginTop: 16 }}>
        Net-new EoR hire (not a conversion) lives under Hire. Same machine after submit.
      </p>
    </div>
  )
}
