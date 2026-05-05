# Design Review Results: LevelUP — All Pages

**Review Date**: 2026-05-04  
**Routes Reviewed**: `/login`, `/signup`, `/profile-setup`, `/dashboard`, `/skills`, `/skills/:id`, `/tasks`, `/goals`, `/analytics`, `/settings`, `/profile`, `/skill-gap`  
**Focus Areas**: Visual Design · UX/Usability · Responsive/Mobile · Accessibility · Micro-interactions/Motion · Consistency · Performance

---

## Summary

LevelUP has a solid foundation with a clean design language, consistent dark-mode support, and well-thought-out Tailwind component classes. However, there are **4 critical bugs** (including a runtime crash and a broken login redirect), **8 high-severity UX issues** (notably a broken mobile sidebar, a near-empty Settings page, and missing accessibility semantics on all modals), and numerous medium/low polish issues around consistency, missing CSS classes, and responsive gaps.

---

## Issues

| # | Issue | Criticality | Category | Location |
|---|-------|-------------|----------|----------|
| 1 | `setSubskillInput` called but state is named `setNewSubskillInput` — crashes runtime when "Generate with AI" button is clicked | 🔴 Critical | UX/Bug | `frontend/src/pages/SkillDetail.jsx:109` |
| 2 | `checkProfileCompletion()` catches all API errors (including CORS) and returns `false`, redirecting every login to `/profile-setup` when backend is unreachable | 🔴 Critical | UX/Bug | `frontend/src/components/ui/SignIn.jsx:41-50` |
| 3 | `w-4.5 h-4.5` is not a valid Tailwind v3 class — Tailwind v3 skips `4.5`, icons in sidebar/topbar render at undefined sizes | 🔴 Critical | Visual Design | `frontend/src/components/layout/AppShell.jsx:47`, `frontend/src/pages/Dashboard.jsx:300,354` |
| 4 | CSS classes `gradient-text`, `page-header`, `skill-card`, `priority-high`, `priority-medium`, `priority-low` are used but never defined in `index.css` — styles silently fail | 🔴 Critical | Visual Design | `frontend/src/styles/index.css`, `frontend/src/pages/Dashboard.jsx:219,297,120` |
| 5 | Mobile sidebar: `style={{ transform: undefined }}` overwrites the CSS translate classes, so the mobile sidebar is permanently visible and cannot be closed on small screens | 🟠 High | Responsive/Mobile | `frontend/src/components/layout/AppShell.jsx:115-116` |
| 6 | Settings page is nearly empty — only a JSON data export exists. Missing: theme preference persistence, account management (change password, delete account), notification toggles | 🟠 High | UX/Usability | `frontend/src/pages/Settings.jsx` |
| 7 | `window.confirm()` is used for destructive delete actions (category and skill deletion) — native browser dialog is unstyled, breaks design consistency, and blocks the main thread | 🟠 High | UX/Usability | `frontend/src/pages/Skills.jsx:74`, `frontend/src/pages/Skills.jsx:106` |
| 8 | SlideOver panels (Skills, Tasks) lack `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and focus trap — screen readers cannot identify the modal, keyboard users can tab outside it | 🟠 High | Accessibility | `frontend/src/pages/Skills.jsx:17-36`, `frontend/src/pages/Tasks.jsx:112-213` |
| 9 | Theme toggle button (`<button title="Toggle theme">`) uses emoji `☀️`/`🌙` and only a `title` attribute — `title` is not reliably read by screen readers; needs `aria-label` | 🟠 High | Accessibility | `frontend/src/components/ui/SignIn.jsx:148-155`, `frontend/src/components/layout/AppShell.jsx:239-247` |
| 10 | Password visibility toggle has no `aria-label` — screen reader announces it as an unlabeled button | 🟠 High | Accessibility | `frontend/src/components/ui/SignIn.jsx:224-231` |
| 11 | Login page hero panel uses `hidden lg:flex` — on iPad / tablet viewport (768–1023px) the hero is hidden but the form does not re-center or fill the full width gracefully | 🟠 High | Responsive/Mobile | `frontend/src/styles/index.css:174` |
| 12 | Initial page load: FCP 5.7s, LCP 5.7s, bundle 4.8 MB — Google Fonts `@import` in CSS blocks rendering; no font `display=swap` or `preconnect` | 🟠 High | Performance | `frontend/src/styles/index.css:1` |
| 13 | Active Streak stat card permanently shows `"—"` with no implementation — looks broken/incomplete to users | 🟡 Medium | UX/Usability | `frontend/src/pages/Dashboard.jsx:281-285` |
| 14 | `onKeyPress` (deprecated in React 17+) used for custom skill/interest tag input — will stop working in future browser versions | 🟡 Medium | UX/Usability | `frontend/src/pages/Profile.jsx:378`, `frontend/src/pages/Profile.jsx:468` |
| 15 | `page-header` class used in `LearningShell` but not defined in CSS — the page title section has no bottom margin, causing content to bump directly into the page body | 🟡 Medium | Visual Design | `frontend/src/components/layout/LearningShell.jsx:14` |
| 16 | Profile page subtitle is duplicated — "Keep your profile up to date..." appears both as `.page-subtitle` in the header AND as `<CardDescription>` inside the card | 🟡 Medium | Consistency | `frontend/src/pages/Profile.jsx:291-305` |
| 17 | Analytics charts grid `xl:grid-cols-[1fr_1fr_0.8fr]` — jumps directly from 1-column (mobile) to 3-column at `xl` breakpoint, leaving a poor mid-range layout at `md`/`lg` screens | 🟡 Medium | Responsive/Mobile | `frontend/src/pages/Analytics.jsx:150` |
| 18 | Custom checkboxes (task/subskill toggles) are `<button>` elements without `role="checkbox"` or `aria-checked` — screen readers announce them as "button", not a toggleable state | 🟡 Medium | Accessibility | `frontend/src/pages/Tasks.jsx:55-59`, `frontend/src/pages/Dashboard.jsx:73-79` |
| 19 | `ProgressRing` and `DonutChart` SVGs have no accessible text — no `<title>`, `aria-label`, or `role="img"` | 🟡 Medium | Accessibility | `frontend/src/pages/Dashboard.jsx:98-112`, `frontend/src/pages/Analytics.jsx:35-60` |
| 20 | Mixed component usage: some pages use shadcn `<Button>` with `rounded-full`, others use custom `.btn-primary` with `rounded-xl` — creates visible inconsistency (SkillDetail vs Tasks/Dashboard) | 🟡 Medium | Consistency | `frontend/src/pages/SkillDetail.jsx:165,200,203` vs `frontend/src/pages/Tasks.jsx:374` |
| 21 | Emoji in toast messages (`'✅ Profile saved successfully!'`, `'⚠️ Please enter your name'`) — inconsistent with Lucide icon usage everywhere else; should use icon components | 🟡 Medium | Consistency | `frontend/src/pages/Profile.jsx:249-220` |
| 22 | Task rows show edit/delete actions only on hover (`opacity-0 group-hover:opacity-100`) — on mobile touch devices these actions are never visible or reachable | 🟡 Medium | Responsive/Mobile | `frontend/src/pages/Tasks.jsx:86-95` |
| 23 | No focus-visible styles on custom interactive elements (`.btn-primary`, `.btn-outline`, `.check-box`, `.nav-item`) — keyboard navigation has no visible focus ring | 🟡 Medium | Accessibility | `frontend/src/styles/index.css:107-125` |
| 24 | Mobile bottom navigation (5 items) does not include Profile or Settings — these are only accessible from the sidebar, which is inaccessible without a hamburger button on mobile | 🟡 Medium | UX/Usability | `frontend/src/components/layout/AppShell.jsx:28-34` |
| 25 | `SkillDetail.jsx` delete button is a prominent `variant="destructive"` at the top of the card with no confirmation prompt — accidental deletions are easy and irreversible | 🟡 Medium | UX/Usability | `frontend/src/pages/SkillDetail.jsx:146-148` |
| 26 | Mobile sidebar has no slide-in/out animation — it renders conditionally without a transition, causing a jarring appearance/disappearance | ⚪ Low | Micro-interactions/Motion | `frontend/src/components/layout/AppShell.jsx:100-107` |
| 27 | Inline gradient `style={{ background: 'linear-gradient(...)' }}` used in Dashboard AI CTA and auth-hero instead of Tailwind `bg-gradient-to-br from-* to-*` — harder to maintain and override | ⚪ Low | Visual Design | `frontend/src/pages/Dashboard.jsx:436`, `frontend/src/styles/index.css:175` |
| 28 | Login form `<button type="button">Forgot password?</button>` is placed between label and input, breaking visual flow — it should sit to the right of the Password label | ⚪ Low | Visual Design | `frontend/src/components/ui/SignIn.jsx:204-211` |
| 29 | `ProgressRing` `style={{ transition }}` is set inline on the SVG `<circle>` — cannot be overridden by Tailwind; should use a CSS class | ⚪ Low | Consistency | `frontend/src/pages/Dashboard.jsx:109` |
| 30 | Settings page `<Button className="rounded-full">` uses rounded-full while page layout uses card surfaces — minor but inconsistent with the overall `rounded-xl` button pattern | ⚪ Low | Consistency | `frontend/src/pages/Settings.jsx:46` |

---

## Criticality Legend
- 🔴 **Critical**: Crashes runtime, blocks user flow, or silently breaks core styles
- 🟠 **High**: Significantly impacts usability, accessibility, or mobile experience
- 🟡 **Medium**: Noticeable friction or inconsistency; should be addressed before release
- ⚪ **Low**: Polish improvements; nice-to-have

---

## Next Steps

**Immediate (before any QA):**
1. Fix `setSubskillInput` → `setNewSubskillInput` in SkillDetail (#1)
2. Fix `checkProfileCompletion` to distinguish network errors from "no profile" (#2)
3. Add missing CSS utility classes: `gradient-text`, `page-header`, `skill-card`, `priority-high/medium/low` (#4)
4. Replace `w-4.5 h-4.5` with `w-[18px] h-[18px]` or use inline style `{ width: 18, height: 18 }` (#3)

**High Priority Sprint:**
5. Fix mobile sidebar (remove `style={{ transform: undefined }}` and use proper Framer Motion or CSS transition) (#5)
6. Add `role="dialog"` / `aria-modal` / focus trap to all SlideOver panels (#8)
7. Add `aria-label` to all icon-only buttons (theme toggle, password toggle, avatar) (#9, #10)
8. Add `role="checkbox"` and `aria-checked` to custom checkbox buttons (#18)
9. Expand Settings page with theme, account, and notification sections (#6)
10. Fix Google Fonts import to use `preconnect` in `index.html` + `display=swap` (#12)

**Medium Priority:**
11. Replace `window.confirm()` with an in-app confirmation dialog component (#7)
12. Add `focus-visible` ring styles to all custom button classes (#23)
13. Add SVG accessible text to `ProgressRing` and `DonutChart` (#19)
14. Standardize button rounding to `rounded-xl` everywhere (#20)
15. Replace emoji in toasts with Lucide icons (#21)
16. Make task row edit/delete accessible on touch (show on long-press or add a `⋯` menu) (#22)

**Low Priority / Polish:**
17. Animate mobile sidebar with Framer Motion slide-in (#26)
18. Replace inline gradient styles with Tailwind classes (#27)
19. Implement the Active Streak feature or remove the card (#13)
20. Fix Analytics chart grid to add an `md:grid-cols-2` intermediate step (#17)
