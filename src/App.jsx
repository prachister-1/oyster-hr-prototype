import { useMemo, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { BRAZIL_CONTRACTORS } from './data'
import { FLOW } from './flow'
import { AppCtx } from './state'
import Shell from './components/Shell'
import Home from './pages/Home'
import People from './pages/People'
import Person from './pages/Person'
import Hire from './pages/Hire'
import Payroll from './pages/Payroll'
import Invoices from './pages/Invoices'
import Expenses from './pages/Expenses'
import TimeOff from './pages/TimeOff'
import Reports from './pages/Reports'
import Compliance from './pages/Compliance'
import Convert from './pages/Convert'
import Conversion from './pages/Conversion'
import Ops from './pages/Ops'
import Flow from './pages/Flow'
import Lifecycle from './pages/Lifecycle'
import TeamMember from './pages/TeamMember'
import Changes from './pages/Changes'
import Finance from './pages/Finance'

function AppInner() {
  const nav = useNavigate()
  const [notes, setNotes] = useState(true)
  const [workers, setWorkers] = useState(BRAZIL_CONTRACTORS)
  const [wizard, setWizard] = useState(0)
  const [launched, setLaunched] = useState(false)
  const [play, setPlay] = useState(0)
  const [role, setRole] = useState('admin')
  const [hires, setHires] = useState([])

  function applyPlay(i) {
    const next = Math.max(0, Math.min(FLOW.length - 1, i))
    const f = FLOW[next]
    setPlay(next)
    setRole(f.role)
    if (f.wizard !== undefined) setWizard(f.wizard)
    if (next >= 8) {
      setLaunched(true)
      setWorkers((ws) =>
        ws.map((w) => (w.block ? { ...w, status: 'blocked' } : { ...w, status: 'converted' })),
      )
    }
    nav(f.path)
  }

  const value = useMemo(
    () => ({
      notes,
      setNotes,
      workers,
      setWorkers,
      wizard,
      setWizard,
      launched,
      setLaunched,
      play,
      role,
      setRole,
      applyPlay,
      hires,
      setHires,
    }),
    [notes, workers, wizard, launched, play, role, hires],
  )

  return (
    <AppCtx.Provider value={value}>
      <Shell notes={notes} setNotes={setNotes}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flow" element={<Flow />} />
          <Route path="/people" element={<People />} />
          <Route path="/people/:id" element={<Person />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/time-off" element={<TimeOff />} />
          <Route path="/changes" element={<Changes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/conversion" element={<Conversion />} />
          <Route path="/ops" element={<Ops />} />
          <Route path="/lifecycle/:view" element={<Lifecycle />} />
          <Route path="/me" element={<TeamMember />} />
          <Route path="/me/:view" element={<TeamMember />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </AppCtx.Provider>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppInner />
    </HashRouter>
  )
}
