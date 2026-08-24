# Oyster HR — clickable prototype

Interview case study prototype for **Senior Director of Product, EOR**. Not affiliated with Oyster. Fictional customer: Lumina Labs. Fictional Brazil 30-day contractor → EOR conversion.

**Live demo:** after the first `gh-pages` publish, https://prachister-1.github.io/oyster-hr-prototype/

If that URL 404s, open the repo → **Settings → Pages → Deploy from branch `gh-pages` / root**.

This repo is only the Oyster interview prototype. It is **not** Room Readiness (`room-readiness-coordinator`) and **not** TravelXen (`travelxen-consultant-prototype`).

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). Routes use hash URLs, e.g. `/#/hire`.

## Demo path (about 8 minutes)

1. **Home** — one workforce. Click the Brazil banner.
2. **Convert** — walk Scope → Classify → Compensation → Exceptions → Launch.
3. **Command center** — swimlanes and the 10 workers.
4. **Ops queue** — Legal / Country Expert / Support briefs.
5. **Hire** — new employee in Brazil (EOR / CLT), or convert the existing 10.
6. **Reports** — metrics and where AI is allowed.

Toggle **Presenter notes** in the top bar if you want coaching lines hidden during the panel.

## Assumptions (stated in-product)

- 10 Brazil PJ contractors must convert to CLT via EOR by 21 Sep 2026.
- CLT employer cost ≈ 1.75× base salary.
- EOR fee USD 699 / employee / month (public 2026 list price).
- Two workers blocked (IP novation, CPF re-verify).
- AI drafts and routes. It does not invent employment terms.
