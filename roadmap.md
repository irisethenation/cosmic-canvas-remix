# Roadmap

## Payment & account system repair (approved plan 2026-11-02) — COMPLETE
- [x] Phase 1 DB hardening: billing tables locked (user writes removed), tier INSERT trigger, env-scoped entitlements (`effective_tier`, `subscription_tier_for`, `current_app_env`), curriculum view filter, course tier_required=1 (all three tiers unlock the programme — user confirmed)
- [x] Phase 2 webhook rewrite: event ledger, idempotency, attribution validation, 500-on-error, payment history
- [x] Phase 2 edge functions: customer-portal, manage-subscription (change plan/cancel/resume), reconcile-refunds, hardened get-paddle-price — all deployed
- [x] Phase 2 frontend: verified checkout success page (polls DB, never trusts URL), billing self-service card, account settings with deletion requests
- [x] Phase 3: auth flow fixes (signup confirmation notice, redirect-back after sign-in, recovery-link gating), lesson journey fixes (state reset, cross-module nav, resume position, throttled progress writes), shared catalog config, paid-calls pay-first flow with post-payment scheduling
- [x] Phase 4: Terms / Refund (14-day) / Privacy pages naming Global Executive Marketing Limited, footer legal links + seller disclosure
- [x] Business-rule checks: all 8 catalog prices verified; browser verification of policy pages, course page, footer — no console errors; build OK

## Open (blocked on user)
- [ ] Four Calendly scheduling URLs for paid calls (fallback in place: pay-first, then "we'll email you to schedule")
- [ ] User signs into own preview account for authenticated purchase testing (test card 4242 4242 4242 4242, any future expiry, CVC 123; decline card 4000 0000 0000 0002)
- [ ] Go-live: Paddle identity verification in Payments tab; policy pages should be reviewed against the business before publishing

## Done
- [x] Audit catalog, auth, purchases, account management, entitlements, renewals (docs/payment-flow-audit.md)
- [x] Seller identity confirmed: Global Executive Marketing Limited (on behalf of iRise.academy)
- [x] Payment provider enabled (Paddle) — test + live environments
- [x] Products created: course £149 one-time, 3 subscription tiers, 4 paid-call products
- [x] Business logic confirmed: instant unlock, cancel = access until period end, prorated plan changes, 14-day refund
