# CLAUDE.md

## Project Purpose
This project is a UI-only sales demo for an AI-powered logistics intelligence and margin optimization platform.

The purpose is not backend functionality.
The purpose is to impress a client, communicate product vision clearly, and build trust during pre-sales conversations.

This must feel like a premium enterprise SaaS product.

---

## Core Principle
Whenever there is a tradeoff between deeper technical logic and stronger visual presentation, prioritize stronger visual presentation.

This is a demo-first application.

---

## Technical Constraints
- Use React + Vite
- Use TypeScript
- Use Tailwind CSS
- No backend server
- No real API integration
- No database
- No authentication backend
- No external dependency on live services for app functionality
- Use static mock data and frontend-only state

---

## Design Standards
- The UI must look premium, modern, and enterprise-grade
- Avoid generic admin dashboard styling
- Default theme should be a dark professional theme
- Desktop-first design is acceptable, but layout should remain responsive
- Strong spacing, hierarchy, readability, and polish are required
- Use subtle motion and micro-interactions
- Avoid over-animation
- Avoid clutter, but do not leave pages feeling empty
- Every major page should look presentation-ready

---

## UX Standards
- The app should support pre-sales storytelling
- The user should be able to move from high-level executive insights to operational details
- Important insights should be easy to scan
- Each page should have clear entry points: KPIs, charts, filters, tables, alerts, recommendations
- Use realistic status badges, priority levels, timelines, drawers, side panels, and tabs
- Prefer believable workflows over placeholder blocks
- Add rich but clean detail views

---

## Product Story to Preserve
This platform is a unified logistics control tower that combines:
- drayage visibility
- warehouse intelligence
- shipment tracking
- margin optimization
- demand forecasting
- dispatch planning
- exception management
- customer transparency
- multi-entity benchmarking
- executive reporting
- workflow automation
- integration visibility

The UI should make this story obvious.

---

## Required Pages
At minimum, maintain and improve these pages:

1. Executive Dashboard
2. Logistics Command Center
3. Container & Drayage Visibility
4. Warehouse Intelligence
5. Demand Forecasting & Capacity Planning
6. Margin Optimization
7. Dispatch & Load Planning
8. Exception Management
9. Customer Portal
10. Multi-Entity Comparison
11. Analytics Workbench
12. Workflow Automation
13. Integrations Overview

---

## Mock Data Rules
- Use realistic and believable logistics data
- Include warehouses, containers, shipments, lanes, customers, carriers, drivers, costs, margin values, exceptions, and forecasts
- Data should support storytelling, not random decoration
- Ensure statuses, names, and metrics feel operationally credible
- Reuse data consistently across pages where possible

---

## UI Priorities
Prioritize the following:
1. Visual polish
2. Believable enterprise UX
3. Strong storytelling
4. Reusable components
5. Clean architecture
6. Smooth navigation
7. Readable code

---

## Component Rules
Create reusable patterns for:
- KPI cards
- metric panels
- data tables
- status badges
- filter bars
- chart cards
- detail drawers
- alert banners
- timeline items
- section headers

Do not repeat large chunks of UI unnecessarily if they can be abstracted cleanly.

---

## Navigation Rules
- Use a polished sidebar
- Use a topbar with global search / command bar feel
- Add breadcrumbs where useful
- Add filters like date range, facility, business unit, region, customer, lane where appropriate
- Navigation should feel like a real enterprise product

---

## Page Quality Rules
Every page should include enough richness to feel real:
- summary metrics
- one or more charts
- table or operational list
- alerts or recommendations
- contextual detail panels or insights

Do not create shallow pages with only one chart and a title.

---

## Motion Rules
- Use Framer Motion subtly
- Smooth card entrance and hover effects are good
- Avoid flashy, distracting, or playful animations
- Motion should reinforce premium enterprise feel

---

## Visual Language
Prefer:
- refined typography
- strong contrast
- premium cards
- clean shadows
- controlled use of borders
- elegant status colors
- layered dashboard layouts
- operational seriousness

Avoid:
- toy-like styling
- random gradients everywhere
- cartoonish visuals
- excessive neon
- generic template layouts

---

## Code Quality Rules
- Keep feature-based folder organization
- Separate mock data from UI components
- Keep components composable
- Use clean TypeScript types
- Avoid overly clever abstractions
- Favor maintainable and readable code

---

## Demo Success Criteria
The demo is successful if:
- it feels like a real logistics SaaS platform
- it looks premium enough to impress a client
- it supports a persuasive product walkthrough
- it clearly communicates operational visibility + AI intelligence + financial impact
- it helps close a lead

---

## Final Reminder
This is a trust-building UI demo, not a backend product build.

Optimize for:
- clarity
- polish
- realism
- confidence
- visual impact
