import { COUNTRY_GUIDES } from './data'

export function personAi(p, { converted } = {}) {
  if (!p?.name) return null

  if (p.hireKind === 'new') {
    return {
      title: `Finish ${p.name}’s ${p.country} hire on this record`,
      body: `Invite is out. Engagement type is ${p.type === 'payroll' ? 'own-entity payroll' : p.type === 'eor' ? 'EOR' : 'contractor'}. If classification later changes, flip the type — do not open a second profile.`,
      next: p.type === 'eor' ? 'Finance funds the deposit. Country expert only if KYC fails.' : 'Complete local right-to-work, then first payroll.',
      human: 'Hiring manager confirms start. Finance if a deposit is unpaid.',
      tags: ['next-best-action', 'missing-data detection'],
      line: 'Onboarding · same record',
    }
  }

  if (converted) {
    return {
      title: 'Employment is live on this worker ID',
      body: 'Type flipped contractor → EOR. Same People row. First CLT cycle is 30 Sep.',
      next: 'Watch the first payroll. Offboarding still goes through Oyster.',
      human: 'Payroll only if the first cycle throws an exception.',
      tags: ['case summarisation'],
      line: 'Converted · watch first payroll',
    }
  }

  if (p.block === 'ip' || p.id === 'br-04') {
    return {
      title: 'Hold Diego on PJ until IP is novated',
      body: 'Eligibility is employment. The blocker is Studio Norte IP, not classification. Generating a CLT now would be wrong.',
      next: 'Keep him off the 30 Sep lock. Legal owns the novation brief.',
      human: 'Legal + Country Expert. Priya countersigns the letter.',
      tags: ['routing', 'next-best-action'],
      line: 'Hold · IP novation',
    }
  }

  if (p.block === 'docs' || p.id === 'br-10') {
    return {
      title: 'Request only RG + CPF',
      body: 'Score is employment. CPF checksum failed. Do not re-ask for address or bank. Do not issue CLT on a stale identity.',
      next: 'Country Expert confirms against Receita Federal, then generate CLT.',
      human: 'Marina Costa. Worker uploads two documents.',
      tags: ['missing-data detection', 'routing'],
      line: 'Blocked · re-verify identity',
    }
  }

  if (p.id === 'br-07') {
    return {
      title: 'Do not auto-convert Gabriela',
      body: '32h and a second client. Score 71 is below the exclusive-40h bar. Full-time CLT would be wrong; staying PJ is still risky.',
      next: 'Confirm 32h with Priya, then part-time CLT plus written second-client disclosure.',
      human: 'Country Expert on the terms. Support confirms hours with Lumina.',
      tags: ['risk flagging', 'routing'],
      line: 'Expert path · 32h',
    }
  }

  if (p.country === 'Brazil' && (p.type === 'contractor' || p.invoice)) {
    return {
      title: 'Convert on the standard path',
      body: 'Exclusive hours, Lumina manager, Lumina tools. This is employment under pejotização guidance — not a contractor renewal.',
      next: 'Accept EOR / CLT on this record. Keep the same worker ID.',
      human: 'None unless a document gate fails later.',
      tags: ['risk flagging', 'next-best-action'],
      line: 'Convert · standard path',
    }
  }

  if (p.country === 'India' && p.type === 'contractor') {
    return {
      title: 'Run eligibility before the next SOW',
      body: 'Exclusive product work should not sit on a contractor agreement. India has no Lumina entity — employment-like work goes EOR.',
      next: 'Score hours and exclusivity. Convert on this record if it looks like employment.',
      human: 'India country expert if the analyser is ambiguous.',
      tags: ['risk flagging'],
      line: 'Contractor · score exclusive work',
    }
  }

  if (p.country === 'Mexico' && p.type === 'contractor') {
    return {
      title: 'Keep Mexico on the analyser',
      body: 'One contractor seat. Not a 30-day case. Still score exclusivity before renewal.',
      next: 'No conversion case yet. Re-run if hours go exclusive.',
      human: 'None until eligibility flips.',
      tags: ['risk flagging'],
      line: 'Watch · contractor',
    }
  }

  return null
}

export function countryAi(name) {
  const g = COUNTRY_GUIDES[name]
  if (name === 'Brazil') {
    return {
      title: 'Convert 8. Route 2. Do not re-contract.',
      body: '10 PJ contractors look like employment. Deadline 21 Sep. Straight-through for eight; Diego, João, and Gabriela are the human path.',
      next: 'Open conversion. Hire net-new Brazil seats as EOR, not PJ.',
      human: 'Legal, Country Expert, Support only on exceptions.',
      tags: ['risk flagging', 'next-best-action'],
    }
  }
  if (name === 'India') {
    return {
      title: 'Score the 3 contractors before renewal',
      body: 'No India entity on file. Exclusive product work should not stay on a SOW.',
      next: 'Open People filtered to India contractors, then hire via EOR if employment-like.',
      human: 'India country expert if the score is ambiguous.',
      tags: ['risk flagging'],
    }
  }
  if (g?.entityOnFile) {
    return {
      title: `Hire onto Lumina payroll in ${name}`,
      body: `${name} entity is on file. Exclusive work is employment — not a new contractor aisle.`,
      next: `Start hire in ${name}. Type should come out payroll.`,
      human: g.expert,
      tags: ['routing'],
    }
  }
  if (g && !g.entityOnFile) {
    return {
      title: `EOR if this is employment in ${name}`,
      body: `No ${name} entity on file. Hours, exclusivity, and tools decide contractor vs EOR.`,
      next: `Start hire in ${name}. Do not default to contractor.`,
      human: g.expert,
      tags: ['routing'],
    }
  }
  return null
}
