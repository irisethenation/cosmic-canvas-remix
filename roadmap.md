# Roadmap

## In progress
- [ ] Create payment provider products: course one-time (£149), 3 subscription tiers, 4 paid-call products
- [ ] Confirm business logic with user (purchase, subscribe, cancel, upgrade/downgrade)
- [ ] DB migration: `course_purchases` table + Paddle columns on `subscriptions` + RLS for purchased lessons
- [ ] Edge functions: `_shared/paddle.ts`, `get-paddle-price`, `payments-webhook` (tier bump, course unlock, call bookings)
- [ ] Frontend: `src/lib/paddle.ts`, `usePaddleCheckout` hook, test-mode banner
- [ ] Wire purchase CTA in `UpgradeCTA` + course detail to open checkout for the current course (sign-in required)
- [ ] Wire checkout for paid calls in `PaidCalls.tsx`
- [ ] Regenerate DB types, deploy functions, verify checkout opens end-to-end in preview
