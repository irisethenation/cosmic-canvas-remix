# Purchase and account flow audit

Audit date: 28 October 2026. Read-only application audit; no payment, account, or access behavior changed during this review.

## Verified current setup

- React/Vite client with Lovable Cloud authentication, Postgres RLS, and server functions. Preview and published app share one database.
- Email/password authentication is enabled; signups enabled; email confirmation required; anonymous accounts disabled. Public hosted settings report Google disabled. The existing UI offers only email/password. Password protection and redirect allowlists were not independently verified through privileged hosted settings.
- Public course catalog contains one published programme: Agnotology & Epistemic Sovereignty Programme, 72 published lessons, four free previews, and 68 paid lessons. Its `tier_required` is **0**, despite the paid-course offer.
- Eight active test prices match the displayed base GBP prices: course £149 once; subscriptions £29/£79/£249 monthly; calls £15/£27/£47/£97 once. Final tax treatment/localized checkout totals still require pricing-preview handling.
- All four call products lack Calendly URLs. There are five auth users but no subscriptions, course purchases, or call bookings at audit time.
- Test app webhook destination is active and subscribes to subscription create/update/cancel and transaction complete/failure/cancel. A second destination supplies platform analytics; both must remain intact. Adjustment events are not delivered to the app destination.
- Live readiness has not started; latest publication, seller verification, and reviews are outstanding. Real checkout is not available yet.

## Current technical flow

1. AuthModal signs in or creates an email/password account; signup stores name in user metadata. Signup triggers provision tier-zero profile and visitor role.
2. ProtectedRoute checks auth and useAgreements for dashboard/onboarding/paid-call pages. Courses and lessons are public routes; lesson content is checked by RLS.
3. Buy buttons choose hardcoded human-readable price IDs. get-paddle-price resolves a provider price through the connector gateway. Paddle.js environment comes from the client token prefix.
4. Browser checkout opens with items and client-supplied `customData` containing user/course/booking IDs. Return URL includes `checkout=success`.
5. payments-webhook verifies the raw signature using the selected environment. Subscription events upsert by user ID, map provider statuses to uppercase enums, and copy an environment-specific tier into the shared profile. Course transactions insert purchase rows; call transactions mark the supplied booking paid.
6. Lessons RLS checks free status, a paid purchase, or profile tier. The UI independently checks purchase existence and profile tier. Renewal dates update through subscription.updated; recurring payment history is not stored separately.
7. CheckoutSuccessHandler announces unlocked access from the return URL alone and refreshes the auth session; it does not verify fulfillment.

## Confirmed defects and gaps

### Security and entitlement integrity

1. **Self-writable billing state:** deployed subscriptions and bookings policies allow users to insert/update their own records, including status/payment fields. Effective table privileges permit those operations. These fields must be server-owned.
2. **Profile creation loophole:** tier-protection trigger covers UPDATE only. Normal signup creates tier zero, but a missing-profile account could insert a chosen tier.
3. **Untrusted checkout attribution:** signed events trust browser-supplied user/course/booking IDs. Call fulfillment checks only booking ID, not owner or matching purchased product. Course fulfillment accepts any supplied course ID for the single course price.
4. **Test/live leakage:** subscription uniqueness is user-only; course uniqueness is user/course-only; purchase and lesson checks omit environment; shared profile tier can be changed by test events; bookings lack payment-environment identity. Test data can overwrite or unlock live access.
5. **Expiry depends on another event:** cached profile tiers do not automatically expire with time. ACTIVE/TRIALING calculation ignores expiry. PAST_DUE behavior differs from documented retry grace. Paused subscriptions are treated as canceled.
6. **Membership currently cannot unlock this programme:** its tier requirement is zero, while paid lesson membership logic requires a positive course tier. Membership benefits need explicit confirmation.
7. **Purchase/display inconsistency:** CourseDetail treats any purchase row as access, ignoring paid/refunded status. Course/module policies do not recognize purchases for nonpublic courses. Publication checks do not consistently include parent course/module.
8. **Draft metadata exposure:** public curriculum view itself has no publication predicates; client filtering is insufficient.
9. **Agreements fail open:** loading races/errors can permit protected pages; agreement checks do not guard checkout or paid lesson RLS. Acceptance is by row ID, so changing text/version in place does not require renewed consent.

### Payment lifecycle and account functionality

10. **False success:** changing URL query to checkout=success shows an unlocked message without payment. No pending/failed fulfillment state, polling, or reliable query invalidation.
11. **Failed webhook writes acknowledged:** database errors are discarded/logged and HTTP 200 returned, preventing reliable retries. Unknown update events are discarded.
12. **No event ledger/order protection:** no durable event inbox, event deduplication, atomic fulfillment, stale-event guard, or operational retry/reconciliation flow. Course check-then-insert can race.
13. **Incorrect subscription identity/history:** UNIQUE(user_id) and user-ID upserts overwrite subscriptions across environments and resubscriptions; unknown price mapping falls back to tier 1. Only the first line item is handled.
14. **Missing billing management:** no change-plan preview/confirmation, prorated update, cancellation/resumption, hosted billing portal, invoices/payment history, or payment-method update. Buying again risks an additional provider subscription rather than changing one.
15. **Incomplete failures/renewals:** transaction.payment_failed and transaction.canceled are not handled; no renewal payment ledger or payment-retry banner. No financial reconciliation.
16. **Refunds not implemented:** 14-day copy exists, but no request/approval workflow, adjustment sync, or access/booking changes after approved refunds. Adjustment events are unavailable on the fixed app subscription; use protected scheduled/manual API reconciliation rather than modifying destinations.
17. **Calls cannot be delivered end-to-end:** no configured scheduling URLs; payment does not create a scheduled appointment. If a URL is added, current code bypasses checkout; closing the widget fabricates a pending booking without confirming scheduling. No reschedule/cancellation/no-show/credit-consumption handling.
18. **Account settings absent:** no self-service name/email edits, dedicated password change, session controls, or account deletion request. Admin tier edits share the field overwritten by payment recomputation; manual grants need separation from purchased access.
19. **Signup confirmation/continuation gaps:** signup welcome omits required email confirmation. Sign-in/onboarding lose the original destination and purchase selection. Recovery screen renders without a recovery session; listener cleanup is ineffective. Preview-to-production recovery redirects need verification.
20. **Lesson journey issues:** lesson state/navigation/completion can remain stale when lesson/user changes; initial progress creation is not reflected locally, progress writes can flood on video time updates, resume position is not restored, and navigation stops at module boundaries. Dashboard progress uses attempted lessons rather than all lessons. Existing paid users may still see a purchase CTA after a free preview.
21. **Catalog fragmentation:** course price applied to all course pages, calls mapped by display name, repeated prices in UI/server, resolver accepts arbitrary IDs and first result without upstream/active/uniqueness validation. No admin-safe mapping/configuration or unavailable-product state. Membership exploration link leads to programmes, not membership plans; one empty-state View Plans button has no action. Checkout errors are swallowed by callers.
22. **Operational gaps:** payment schema is in drizzle/migrations while foundation schema is in supabase/migrations; delivery convention needs documenting. No automated test suite/test command, lifecycle alerting, payment audit history, or reconciliation dashboard. Deployed webhook JWT setting remains to verify; unsigned signature rejection previously worked but is not proof of the full purchase flow.
23. **Launch policy gaps:** no public Terms/Privacy/Refund routes, seller identity missing for policy drafting, and approval is incomplete. Preserve educational disclaimer and exact footer branding.

## Existing rules to retain

- Sign-in required for checkout; instant unlock only after verified successful payment.
- Cancellation retains access through the paid period.
- Immediate prorated upgrades/downgrades; failed immediate payment should not grant a higher plan.
- Fourteen-day refund period. Exact approved-refund entitlement behavior remains undecided.
- Free Module 0 previews stay public; unpublished content stays private.

## Repair direction, pending decisions

- Server-created checkout transactions/intents bound to verified user, stable product mapping, quantity, target, and environment.
- Server-owned payment projections and environment-aware dated entitlements, separate from manual admin grants.
- Atomic idempotent event processing, strict environments, transaction/subscription/adjustment history, reconciliation and retry visibility.
- Consistent server and UI access checks, publication filters, fail-closed agreements, and meaningful fulfillment states.
- Subscription change preview/confirmation, cancellation, portal, failed-payment recovery; pay-first call fulfillment once scheduling details are supplied.
- Account settings and recovery/confirmation fixes, purchase continuation, accurate progress, approved-refund behavior.
- Targeted rule tests and end-to-end preview checks; preserve existing public content and administrative styling.

## Verification and preview test outline

Verified in browser: programme shows four clickable free lessons and paid curriculum; Buy opens registration/sign-in; invalid-session reset page incorrectly renders its form. No page exceptions observed on the inspected course screen.

Authenticated purchase testing is blocked: no account matches the requesting user's verified email. Do not choose another person's account. User must sign in/create their own preview account or identify an authorized test account for approval. No test transactions were fabricated.

After repairs: confirm email and accept agreements; buy course; wait for verified access and reload; start subscription; preview/confirm higher/lower plan; cancel and confirm expiry date; update billing details; test rejected payment and recovery; buy/schedule a call; request/approve/refund and check access; sign out and verify locks. Test both environments remain isolated and spoofed success URLs never unlock access.

In **test checkout only**, use `4242 4242 4242 4242`, CVC `123`, any future expiry, any cardholder name. Declined card: `4000 0000 0000 0002`; 3DS: `4000 0000 0000 3220`. Real cards must not be used in preview. The checkout iframe requires manual card entry; automation can verify opening, trusted transaction arguments and app-side fulfillment, not checkout-internal payment entry. Renewal tests can move the test billing date at least 30 minutes ahead using an authorized provider operation.