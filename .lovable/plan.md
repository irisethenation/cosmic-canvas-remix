# Payment & Account System Repair Plan

Based on the full audit (docs/payment-flow-audit.md, 23 findings) and your confirmed business rules: instant unlock on verified payment, access until period end on cancellation, immediate prorated plan changes, 14-day refunds, sign-in required for checkout. Seller identity for policies: **Global Executive Marketing Limited** (operating on behalf of iRise.academy).

## Phase 1 — Security & entitlement integrity

1. **Lock down self-writable billing state** — remove user INSERT/UPDATE policies on `subscriptions` and `paid_call_bookings` payment fields; only the server (webhook) writes these. Keep user read access.
2. **Close profile tier loophole** — extend the tier-protection trigger to INSERT, so no one can create a profile with a chosen tier.
3. **Verify checkout attribution server-side** — the webhook validates that the user/course/booking IDs in checkout data match the real purchaser and product before granting anything; mismatches are rejected and logged.
4. **Separate test and live access** — add environment to uniqueness keys on subscriptions and course purchases; lesson-access checks and profile-tier updates only honor events from the matching environment, so test purchases never unlock the live app (and vice versa).
5. **Time-based entitlement expiry** — profile tier is recomputed from actual subscription state (active/trialing + period end) rather than a stale cached value; past-due gets a short grace, paused is treated correctly.
6. **Fix the programme's tier mapping** — the course currently requires tier 0, so no membership unlocks it. Set the correct tier requirement so the intended plans include it (I'll confirm the exact tier-to-plan mapping with you during implementation if the catalog doesn't make it obvious).
7. **Consistent access checks** — CourseDetail, course/module RLS, and the lesson policies all use the same rule: free lesson OR verified purchase OR qualifying tier, with publication status respected. Draft lessons stop leaking titles through the public curriculum view.
8. **Fail-closed agreements** — protected pages and checkout block while agreement status is loading or errors, instead of letting people through.

## Phase 2 — Payment lifecycle & account features

9. **Real success page** — checkout return no longer trusts the URL; the success screen polls for the verified purchase/subscription record and shows pending / confirmed / failed states. A spoofed `?checkout=success` URL shows nothing.
10. **Reliable webhook processing** — database errors return HTTP 500 so the provider retries; unknown events are logged, not silently dropped; add an event ledger with deduplication so replays can't double-grant.
11. **Correct subscription identity** — key subscriptions by the provider's subscription ID (per environment), so resubscribing after cancel creates a new record instead of overwriting history; unknown prices no longer fall back to tier 1.
12. **Billing self-service** — add a billing section: change plan (with proration preview + confirm step), cancel subscription (keeps access to period end, with resume option), and view payment history. Buying a plan while already subscribed changes the existing subscription instead of stacking a second one.
13. **Failed payments & renewals** — handle payment-failed and transaction-canceled events; show a "payment failed, update your card" banner; record renewal payments in history.
14. **Refund handling** — 14-day refund policy; when a refund is approved, access is revoked (course purchase marked refunded, subscription canceled) via a scheduled reconciliation check against the payment provider.
15. **Paid calls end-to-end** — call products get their scheduling links; the booking is only created after verified payment (no more fake pending bookings from closing the widget). I'll need the four scheduling URLs from you, or I wire it to create the booking and email scheduling details instead.
16. **Account settings page** — edit name, change password, and request account deletion. Admin-granted tiers are stored separately from purchased tiers so payment recomputation never wipes a manual grant.

## Phase 3 — Journey & catalog polish

17. **Auth flow fixes** — signup tells you to confirm your email; sign-in returns you to the page/purchase you came from; the password-recovery screen only renders with a valid recovery session.
18. **Lesson journey fixes** — progress/completion state resets correctly when switching lessons, resume position is restored, navigation continues across module boundaries, and users who already own the course never see the purchase prompt after a free preview.
19. **Catalog cleanup** — price IDs and product mapping live in one shared config used by both UI and server; the price resolver rejects unknown/inactive products; membership links point at the actual plans; checkout errors surface to the user instead of failing silently.

## Phase 4 — Go-live requirements

20. **Policy pages** — create public Terms & Conditions, Refund Policy (14 days), and Privacy Notice naming **Global Executive Marketing Limited** as seller/data controller, with the required reseller disclosure and buyer-terms references. These are required before real payments can be approved. You'll review the wording before publishing.
21. **Preserve existing requirements** — the educational disclaimer and exact footer branding stay untouched; admin dark/minimalist and public bright/glassmorphism styling are preserved.

## What I need from you

- **Four scheduling links** for the paid calls (or confirm: create booking + email details instead).
- **Sign into your own preview account** so I can run authenticated purchase tests.
- **Tier mapping confirmation** if the intended plan-to-course access isn't what the catalog shows.

## How you'll test in the preview (test mode, no real money)

Use test card **4242 4242 4242 4242**, any future expiry, CVC **123**, any postcode.

1. Sign up / sign in, confirm email, accept agreements.
2. Open the course page → Buy → complete checkout with the test card → confirm the success screen shows *confirmed* (not just the URL) and all 68 paid lessons unlock.
3. Sign out → confirm lessons lock again; sign back in → still unlocked.
4. Subscribe to a plan → verify tier unlocks; change to a higher plan → confirm proration preview and instant upgrade; change down → confirm; cancel → confirm access shows until period end; resume.
5. Trigger a failed payment (use card **4000 0000 0000 0341** for decline) → confirm the payment-failed banner appears and access isn't granted.
6. Buy a paid call → confirm booking appears as paid and scheduling works.
7. Try spoofing `?checkout=success` without paying → confirm nothing unlocks.
8. Check the new account settings page (name change, password change).

## Technical notes

- Database changes ship as one migration; edge functions redeployed; no changes to the two registered webhook destinations.
- Targeted tests added for the business rules you care about (tier gating, environment isolation, refund revocation, proration rules) and run before finishing.
- Refund sync uses periodic reconciliation (the app webhook destination doesn't receive adjustment events); destinations are not modified.
