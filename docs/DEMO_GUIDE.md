# Meridian — Demo Guide

> AI-Powered Logistics Intelligence & Margin Optimization Platform
>
> Internal · Sales Engineering · v1.0

---

## 1. What This Demo Is

Meridian is a UI-only sales demo for a unified logistics control tower. It connects drayage, warehouse, dispatch, customer transparency, and margin intelligence — and uses AI to convert every operational signal into a margin decision.

The product story in one sentence: **"One control tower for your entire logistics network — protecting margin on every load."**

The platform demonstrates four jobs:

| Job | What it does |
|---|---|
| **See** | Live containers, shipments, dock activity across every facility |
| **Predict** | 12-week demand and capacity forecasts with confidence bands |
| **Protect** | Per-load profitability with AI margin recommendations |
| **Act** | Auto-mitigation workflows that turn recommendations into action |

---

## 2. Why It Matters to the Client

Logistics businesses lose margin in places they cannot see:
- Detention and demurrage from late drayage
- Dock congestion missing outbound SLAs
- Carrier OTP slipping below contract
- Chassis pool fees and accessorial creep on specific lanes
- Negative-margin shipments hidden inside positive-margin lanes

Meridian surfaces these losses, attributes them, and proposes the fix — typically with $80k–$140k/month in recoverable margin in a mid-sized operation.

---

## 3. Tech & Architecture (Quick)

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS with CSS-variable theming (light + dark) |
| Charts | Recharts |
| Motion | Framer Motion (subtle micro-interactions) |
| Icons | Lucide React |
| Routing | React Router v6 |
| State | React hooks + localStorage for theme/auth/presenter dock |
| Backend | None — UI-only demo with realistic mock data |

The product is designed to sit *across* existing WMS, TMS, ERP, EDI, and visibility systems — not replace them. Integrations page shows 12 connectors (SAP, NetSuite, Manhattan WMS, Blue Yonder TMS, Project44, EDI Gateway, etc.) feeding a unified data layer.

---

## 4. Pre-Demo Checklist (15 min before the call)

- [ ] Run `npm run dev` and confirm `http://localhost:5173` loads.
- [ ] Sign in with the pre-filled demo credentials. Confirm you land on Executive Dashboard.
- [ ] Verify the **Presenter Dock** (bottom-left, purple icon) opens and lists 7 scenarios.
- [ ] Verify the **AI Chatbot** (bottom-right, blue gradient pill) opens.
- [ ] Toggle theme (sun/moon icon top-right) once to confirm it works, then leave on light.
- [ ] Open Customer Portal, confirm the customer switcher dropdown works (Halcyon → Crescent → Northwind).
- [ ] Mute Slack, calendar pop-ups, and notifications.
- [ ] Have this guide on a second screen.

---

## 5. The 7-Minute Demo Flow

This is the recommended live narrative. The Presenter Dock has these scenarios pre-loaded — you can click through them or follow the script below.

### Scene 1 — The Setup (60 seconds) · Executive Dashboard

**Click:** Sign in (1 click) → lands on Executive Dashboard

**Say:**
> "This is what your VP of Operations sees when she opens her laptop. Top of screen — what the platform is. Below — three signals AI has surfaced as the things worth her attention right now. Each is clickable into context."

**Point to:**
- Hero pill: "AI-powered logistics intelligence"
- The 4 product tiles (See / Predict / Protect / Act)
- Today's Signals — read the 3 items aloud

**Transition:** "Let's follow the most expensive one — the free-time risk at LAX."

---

### Scene 2 — Drayage & Free-Time Visibility (75 seconds) · Container Visibility

**Click:** "Review" on the first signal (or **Containers** in sidebar)

**Say:**
> "1,126 containers in the network. AI ranked these 8 by risk. The MSCU container — top row — is critical: 14 hours of free-time left, $2,800 demurrage exposure, and the customer is Halcyon, an enterprise account."

**Point to:**
- Per-row free-time bar (green → amber → red)
- The "Free-time Cluster" alert banner at top
- Click MSCU7349182 row → **drawer opens** with timeline, financials, AI recommendation

**Demonstrate:**
- "Click 'Apply AI plan'." → toast confirms

**Transition:** "But this isn't just about a container. It's about what that container is supposed to feed."

---

### Scene 3 — Warehouse + Customer Story (90 seconds) · Customer Portal

**Click:** Customer Portal (sidebar) — already on Halcyon by default

**Say:**
> "This is the same shipment from the customer's perspective. Halcyon's portal — branded for them, white-labeled. Inbound containers tied to their inventory. Warehouse on-hand at LAX, OAK, SAV. Outbound orders waiting."

**Point to:**
- Yellow alert banner: "MSCU7349182 projected delay → PO-44245 at risk"
- The 3-column layout: Inbound · On-hand · Outbound
- Note PO-44245 is "Awaiting inbound"

**Demonstrate:**
- "AI suggests pre-staging 980 units from LAX-01 to cover the cutoff. Click Approve pre-stage." → toast confirms

**Bonus (if you have time):** Switch the customer dropdown to Crescent Foods. Note how the entire view changes — different inventory, different alert (margin erosion instead of delay), different KPIs.

**Transition:** "So the customer is protected. But what about the margin on this shipment?"

---

### Scene 4 — Margin Recovery (90 seconds) · Margin Optimization

**Click:** Margin Optimization (sidebar)

**Say:**
> "Every shipment, customer, lane, and carrier is scored for profitability. The waterfall on the left shows where revenue actually lands. The big number — 18.9% gross margin — is up 2.4 points over plan. But there are leaks."

**Point to:**
- Margin Waterfall chart — call out detention and rehandle losses
- Negative Margin alert at top: SHP-1021 at -21.4%
- AI Recommendations panel on the right

**Demonstrate:**
- Pick the "Raise fuel surcharge 4.2% on SAV → ATL" recommendation. Click **Apply** → see the green "Applied" badge replace the buttons.
- "That's $46,800 a month back in margin. The platform queued the rate change, notified pricing, and updated the lane."

**Transition:** "These are AI recommendations. Let's see what's running automatically."

---

### Scene 5 — AI Chatbot Moment (60 seconds) · From any page

**Click:** The "Ask Meridian AI" pill (bottom-right of any screen)

**Say:**
> "Beyond the dashboards, every operator can just ask. Meridian is context-aware across the whole platform."

**Demonstrate (try one):**
- Click the chip "Which lanes are losing margin?"
- Wait for the typing indicator and the response
- Note the structured meta block (Worst lane / AI recovery / Confidence)

**Try a follow-up:**
- Type: "How is SAV-07?"
- It returns dock utilization + the rebalance plan

**Transition:** "And these recommendations don't just sit there — they execute."

---

### Scene 6 — Workflow Automation (45 seconds) · Workflow Automation

**Click:** Workflow Automation (sidebar — Platform group)

**Say:**
> "8 workflows running today. 1,284 executions in the last 24h. $81k captured in savings. Each is auditable, governable, and reversible."

**Point to:**
- "Free-time alert → AI pull plan" — the playbook visualization (Trigger → Filter → AI → Action → Notify)
- Toggle a flow on/off in the table to show governance

**Transition:** "This is how a single operator can manage what used to take a team."

---

### Scene 7 — The Executive Close (45 seconds) · Multi-Entity Comparison

**Click:** Multi-Entity Comparison (sidebar)

**Say:**
> "And for leadership of a multi-business operation — three business units, normalized into one view. West is your gold standard at 22.4% margin. East is dragging at 14.8%."

**Point to:**
- The 3 BU cards
- The radar chart comparing them across 6 dimensions
- The "Playbook Opportunities" cards at the bottom

**Closing line:**
> "Meridian's value isn't just visibility. It's the ability to find the West Coast playbook, replicate it across the East, and protect margin on every load — automatically. That's why customers see $80k–$140k/month in recovered margin within the first quarter."

**Click:** Back to Executive Dashboard → "Generate board pack" → Modal opens → "This goes out to the board every Monday morning."

---

## 6. Talking Points by Screen (Reference)

| Screen | Headline value | Numbers to call out |
|---|---|---|
| **Executive Dashboard** | "What your VP of Ops sees first" | Revenue $18.4M MTD · margin 18.9% (+2.4 vs plan) · $142k AI savings this week |
| **Command Center** | "Live operations across every facility" | 6 facilities · 87 lanes · 2,418 shipments live |
| **Container Visibility** | "Stop demurrage before it happens" | 5 at-risk containers · $14k exposure · $11k recoverable |
| **Warehouse Intelligence** | "Dock congestion, before it hits SLA" | SAV-07 at 88% util · 6 SLAs at risk |
| **Demand Forecasting** | "Capacity planning, not capacity firefighting" | 173k 12-wk forecast · 92% confidence · 28 scenarios run |
| **Margin Optimization** | "Find margin you didn't know was leaking" | $142k at risk · 4 AI plays · $116k queued recovery |
| **Dispatch Planning** | "AI dispatch every 15 minutes" | 8 loads optimized · +$2,140 savings vs manual · 3 street-turns |
| **Exception Management** | "Triage before SLA breach" | 12 open · MTTR 2h 14m · 38% AI auto-mitigation rate |
| **Customer Portal** | "Higher-end transparency, no extra reporting work" | OTP 94.8% vs 88% industry · branded per customer |
| **Multi-Entity** | "Find the playbook, replicate it" | West 22.4% · South 18.6% · East 14.8% |
| **Analytics Workbench** | "Ask in plain English, no SQL" | 214 queries this week · 1.2s avg query · 182 metrics |
| **Workflow Automation** | "Recommendations that execute" | 24 active flows · 1,284 runs / 24h · 95.7% success |
| **Integrations** | "Sit across what you already have" | 12 connectors · 2.4M events / 24h · 182ms latency |

---

## 7. Anticipated Questions & How to Answer

**Q: "Is the data live?"**
> "This is a UI demo with realistic mock data. The story you're seeing — the container, the customer, the margin recovery — is one consistent scenario across pages. In production it's live, fed by your WMS, TMS, ERP, and event feeds."

**Q: "Is the map real?"**
> "This is a stylized representation. Production uses Mapbox / Google Maps for real geo, with live shipment positions from telematics."

**Q: "How does the AI work?"**
> "Two layers. First, predictive models for demand, ETA, and exception detection — trained on your historical data. Second, an LLM-powered reasoning layer for natural-language queries and recommendation generation, with retrieval over your data warehouse."

**Q: "What about our legacy WMS/TMS?"**
> "Meridian is integration-first, not replacement-first. Look at the Integrations page — SAP, NetSuite, Manhattan, Blue Yonder, EDI, telematics. We sit on top, normalize the events, and add the intelligence layer."

**Q: "How fast can we deploy?"**
> "Pilot in 4–6 weeks for one or two facilities and a handful of integrations. Full network rollout in 90 days."

**Q: "Pricing?"**
> Defer to commercial team — typically per-shipment or per-facility tier-based.

**Q: "Security and compliance?"**
> "SOC 2 Type II, GDPR, CCPA. Audit trails on every workflow. Role-based access for dispatch / warehouse / finance / leadership."

**Q: "What happens when AI is wrong?"**
> "Every recommendation has a confidence score, a preview before apply, and a one-click undo. Workflows are reversible. Nothing happens without an operator-level approval, except for explicitly opted-in auto-mitigations like detention billing or temperature alerts."

---

## 8. The Demo Loop (memorize this)

This is the narrative arc to repeat in any order:

> **Container at port → AI flags free-time risk → Customer impact prevented → Dispatch re-sequenced → Margin protected $4,000 → Workflow logged → Board sees the recovery**

If you remember nothing else, remember those 7 beats.

---

## 9. The Three Demo Personas

The same data, three perspectives:

1. **Executive (Ava Rahman, VP Ops)** — Executive Dashboard, Multi-Entity, board pack modal
2. **Operator (Marco Velasquez, Dispatch Lead)** — Command Center, Container Visibility, Dispatch Planning, Exception Management
3. **Customer (Halcyon Retail)** — Customer Portal

When the client asks "who uses this?" — name all three and show how they each see the same shipment differently.

---

## 10. Post-Demo Follow-up

Send the client:

- A link to the hosted preview (deploy via Vercel — see Appendix)
- The Today's Signals card from the dashboard, screenshotted with their company name swapped in if you have time
- A one-pager with the projected savings from the Margin Optimization page
- Calendar invite for technical deep-dive within 7 days

---

## Appendix A — Demo Credentials

```
URL:        http://localhost:5173
Email:      ava.rahman@halcyon-retail.com
Password:   demo1234
```

Or click "Continue with Google" — it routes to the same demo session.

---

## Appendix B — Keyboard Shortcuts

| Shortcut | What it does |
|---|---|
| `⌘ K` / `Ctrl K` | Focus the global search |
| `⌘ ⇧ P` / `Ctrl Shift P` | Toggle the Presenter Dock visibility |
| `Esc` | Close any open drawer / modal / popover |

---

## Appendix C — Recovery Plan (if something breaks)

1. **App blanks out:** Hard refresh (`⌘ R`). Session is preserved.
2. **Signed out accidentally:** Email is pre-filled — just click Sign In.
3. **Theme stuck:** Toggle once via top-right sun/moon icon.
4. **Chatbot doesn't respond:** It uses keyword matching. If your question doesn't match a topic, it returns a generic help message. Try one of the chip suggestions.
5. **Worst case:** Open a fresh tab, navigate to the dashboard, restart the script from Scene 1.

---

*End of Demo Guide*
