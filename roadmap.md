# Roadmap

## Current audit and repairs
- [ ] Audit catalog, authentication, purchases, account management, entitlements, and renewals against deployed settings.
- [ ] Confirm unresolved business decisions and approve a repair plan.
- [ ] Implement approved repairs with targeted business-rule tests.
- [ ] Verify updated flows and provide a preview test checklist, including test cards.

## Done
- [x] Payment provider enabled (Paddle) — test + live environments
- [x] Products created: course £149 one-time, 3 subscription tiers, 4 paid-call products
- [x] Business logic confirmed: instant unlock, cancel = access until period end, prorated plan changes, 14-day refund
- [x] DB migration: `course_purchases` table, Paddle columns on `subscriptions`, paid-lesson RLS, curriculum view
- [x] Edge functions: `_shared/paddle.ts`, `get-paddle-price`, `payments-webhook` (deployed)
- [x] Frontend: paddle lib, checkout hook, test-mode banner, success toast
- [x] Purchase CTA in UpgradeCTA + course detail (sign-in required, opens checkout for the current course)
- [x] Tier subscription buttons on dashboard SubscriptionCard
- [x] Paid-calls checkout wired (creates pending booking → checkout → webhook marks PAID)
- [x] Verified: build clean, price resolver works, course page shows locked curriculum, sign-in gate works

## Open (blocked on user / outside control)
- [ ] Test a real purchase end-to-end in the preview (needs a signed-in preview account; Paddle checkout iframe can't be automated) — use test card 4242 4242 4242 4242
- [ ] Go live: identity verification + readiness check requires public Terms, 14-day Refund Policy, and Privacy pages, plus the legal business name (ask user when they want to accept real payments)
