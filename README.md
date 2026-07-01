# Fluroxa — Finance SaaS Landing Page

> A production-grade fintech SaaS landing page built as a portfolio project and simulated client-facing product. Designed to demonstrate frontend engineering, UX design, and business thinking — not just visual execution.

**Live demo:** [vkdesigner09.github.io/Fluroxa](https://vkdesigner09.github.io/Fluroxa/)

![Fluroxa homepage preview](https://raw.githubusercontent.com/vkdesigner09/Fluroxa/main/homepage.jpg)

---

## What this is

Fluroxa is a fictional real-time financial dashboard product targeting CFOs and Finance Managers in the Indian B2B market. The landing page serves two purposes:

- **Portfolio piece** — demonstrates frontend implementation, UX thinking, and business awareness at a production level
- **Simulated client product** — built to the same standard I would deliver to an actual client, with real lead capture backend, legal pages, and conversion architecture

The primary conversion goal is demo bookings. Secondary goal is checklist resource lead capture.

Benchmark references: Stripe, Ramp, Mercury, Linear, Vercel.

---

## Tech stack

| Layer     | Choice                               | Why                                                    |
| --------- | ------------------------------------ | ------------------------------------------------------ |
| Markup    | HTML5 (semantic)                     | No abstraction needed for single-page scope            |
| Styling   | Vanilla CSS with custom properties   | Full token system, zero runtime overhead               |
| Behaviour | Vanilla JS (ES2020+)                 | No framework justified for this interaction complexity |
| Backend   | Google Apps Script + Google Sheets   | Serverless lead capture, zero-cost, India-accessible   |
| Hosting   | GitHub Pages → Netlify (in progress) | Netlify for cache headers + deploy previews            |

**Why no framework:** React/Vue adds ~40–100KB of runtime for a page with no dynamic data, no routing, and no shared state. Vanilla stack was the correct architectural choice, not a skill gap. Component reusability was achieved through CSS custom properties + consistent class naming conventions.

---

## Features built

**UX / Interaction**

- Multi-step checklist modal with email capture gate (Step 1 = preview, Step 2 = email, Step 3 = success)
- Pricing toggle (monthly / annual) with animated price swap
- FAQ accordion (single-open, keyboard navigable)
- Scroll-driven step highlight (IntersectionObserver + active state)
- Scroll reveal system (IntersectionObserver, `prefers-reduced-motion` respected)
- Hero chart animation (SVG path draw, dot pulse, runway counter)
- Terminal animation (line-by-line reveal with IntersectionObserver trigger)
- Scroll-to-top button (passive listener, viewport-depth trigger)

**Accessibility**

- WCAG 2.1 AA target
- Full keyboard navigation (Tab, Shift+Tab, Escape, focus trap in modal)
- Skip-to-content link
- `aria-live` regions on form status
- `prefers-reduced-motion` disables all animations globally
- Screen reader compatible modal with proper `aria-hidden` state management
- Semantic heading hierarchy (single `h1`, sequential `h2` per section)

**Lead capture backend**

- Demo form → Google Sheets via Apps Script (keyed by `source: landing_page_demo_form`)
- Checklist modal email capture → same Sheet, different source key (`source: checklist_modal`)
- Honeypot spam filter on demo form
- Owner email notification on submission

**Performance (Lighthouse)**
| Metric | Mobile | Desktop |
|---|---|---|
| Performance | 86 | 99 |
| Accessibility | 95 | 92 |
| Best Practices | 96 | 96 |
| SEO | 92 | 92 |

---

## Business context

**ICP:** Finance Managers and CFOs at Indian B2B companies (SaaS, Fintech, Startups, Agencies, E-commerce), 10–500 person teams, using Tally / Zoho Books / QuickBooks / Razorpay.

**Core pain addressed:** Finance teams spending 9–11 days per month-end manually reconciling data across 3–5 disconnected tools. No single live view of cash runway, burn rate, or P&L.

**Compliance context:** Privacy policy written to DPDP Act 2023 (India's Digital Personal Data Protection Act). Chosen deliberately — relevant regulatory context for Indian B2B market, not a generic GDPR copy-paste.

**Conversion architecture:**

- Hero → value prop + integrations trust signal
- Pain cards → problem qualification
- How it works → objection removal ("takes 15 min, no IT team")
- Dashboard mockup → product credibility
- Features → capability proof
- Social proof → outcome data (aggregated, not attributed)
- Pricing → anchor + featured tier psychology
- FAQ → objection handling (8 questions, each mapped to a known sales objection)
- CTA + lead form → conversion with checklist as secondary capture

---

## Known limitations and intentional decisions

These are deliberate scope choices, not oversights:

| Item                                                                   | Decision                                                                                                                                                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Social media icons (LinkedIn, Twitter, YouTube) in footer are disabled | Placeholder UX — accounts not live. Intentionally shows social presence without dead external links                                                     |
| Testimonial avatars use initials (FM, HF, VF) with no company names    | Aggregated outcome data framing — legally correct for pre-revenue product without real client attribution                                               |
| Checklist Google Drive URL is a placeholder                            | UX flow demonstration — real file would be inserted at launch                                                                                           |
| Footer "Built by" credit present                                       | This is a portfolio project. Credit is intentional                                                                                                      |
| 30+ CSS breakpoints                                                    | Known technical debt — root cause is fixed-pixel base spacing. `clamp()` / `auto-fit` / `minmax()` migration planned post-launch as a separate refactor |
| No framework                                                           | Architectural decision, not limitation. Justified above                                                                                                 |

---

## Project structure

```
/
├── index.html          Main landing page
├── thank-you.html      Post-form submission confirmation
├── privacy.html        Privacy policy (DPDP Act 2023 compliant)
├── terms.html          Terms of service
├── style.css           Single stylesheet (~5500 lines, token-based)
├── script.js           Single JS file (~930 lines, vanilla ES2020+)
└── images/
    ├── logo.png
    ├── icons.svg       SVG sprite (all UI icons)
    └── *.svg           Dashboard sidebar icons
```

---

## Running locally

No build step. No dependencies.

```bash
git clone https://github.com/vkdesigner09/Fluroxa.git
cd Fluroxa
```

Open `index.html` in browser. Or use VS Code Live Server for hot reload.

---

## Author

**Bhumika Trivedi** — UI/UX Designer & Frontend Developer  
The B Factor Digital · Nadiad, Gujarat

Connect with me on : thebfactordigital@gmail.com

_Available for freelance projects and full-time opportunities._

---

_This is a portfolio and demonstration project. Fluroxa Technologies Pvt. Ltd. is a fictional company. All data, testimonials, and metrics shown are illustrative._
