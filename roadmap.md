# Roadmap

## Payment & account system repair (approved plan 2026-11-02)
- [ ] Phase 1 DB hardening: lock billing tables, tier INSERT trigger, env isolation, entitlement functions, curriculum view filter, course tier fix
- [ ] Phase 2 webhook rewrite: event ledger, idempotency, attribution validation, 500-on-error, payment history
- [ ] Phase 2 edge functions: customer-portal, change-plan, cancel-subscription, reconcile-refunds, hardened get-paddle-price
- [ ] Phase 2 frontend: real checkout success page, billing self-service, account settings
- [ ] Phase 3: auth flow fixes, lesson journey fixes, shared catalog config, paid-calls pay-first flow
- [ ] Phase 4: Terms / Refund (14-day) / Privacy pages naming Global Executive Marketing Limited
- [ ] Business-rule tests + end-to-end preview verification

## Open (blocked on user)
- [ ] Four Calendly scheduling URLs for paid calls (fallback: pay-first, then email scheduling)
- [ ] User signs into own preview account for authenticated purchase testing (test card 4242 4242 4242 4242)
- [ ] Go-live: identity verification in Payments tab after policy pages publish

## Done
- [x] Audit catalog, auth, purchases, account management, entitlements, renewals (docs/payment-flow-audit.md)
- [x] Seller identity confirmed: Global Executive Marketing Limited (on behalf of iRise.academy)
- [x] Payment provider enabled (Paddle) — test + live environments
- [x] Products created: course £149 one-time, 3 subscription tiers, 4 paid-call products
- [x] Business logic confirmed: instant unlock, cancel = access until period end, prorated plan changes, 14-day refund
