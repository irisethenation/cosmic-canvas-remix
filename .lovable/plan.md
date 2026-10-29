# Repair purchase, membership, and account flows

## Audit result

The audit identified 23 gaps, recorded with evidence in `docs/payment-flow-audit.md`. Eight test prices match advertised base prices. Public previews and the sign-in prompt work; complete purchase, renewal, refund, and scheduling flows are not yet verified.

The highest risks are customer-editable payment statuses, test activity influencing live access, untrusted purchase attribution, and success messages before fulfillment. Cancellation, prorated plan changes, refunds, appointment delivery, and account settings are incomplete.

## Confirmed rules

- Keep £149 one-time course purchase and £29/£79/£249 monthly plans; require sign-in.
- Memberships provide different course access by tier. Do not invent the allocation or enable unmapped memberships.
- Unlock after verified payment. Cancellation retains access through the paid period.
- Immediate prorated upgrades/downgrades with confirmation; failed immediate payment must not grant the new tier.
- Fourteen-day refund period. Approved full refunds revoke refunded course access or end the refunded membership; partial refunds retain access.
- Calls are paid first, then scheduled; disable sales until scheduling is deliverable.
- Standard self-service: name/email/password changes, billing/history, sign out all sessions, and deletion requests.
- Preserve public Module 0, private drafts, mandatory agreements, educational disclaimer, and exact footer branding.

## What to build

### 1. Secure payments and access

- Make subscription, purchase, and booking payment state server-owned; close profile-tier creation loopholes without removing public previews.
- Create checkouts from authenticated, server-validated products; bind payments to the actual owner and matching course/call.
- Separate test/live records and access checks; keep manual administrator grants separate from payment-derived access.
- Enforce dated entitlements consistently for courses/modules/lessons and account displays. Access must expire without waiting for another payment event.
- Filter draft curriculum at its source. Make agreements fail closed and version-aware for checkout and paid content, preserving public previews.

### 2. Reliable purchases and renewals

- Add durable payment/event history, duplicate/stale-event protection, atomic fulfillment, and retry/reconciliation visibility.
- Handle successful/failed/canceled/renewed/changed/expired states; reject unknown products rather than guessing a paid tier.
- Confirm saved fulfillment, not return URLs; show processing/retry/failure states and refresh content after confirmation.
- Validate active catalog prices, stable product mappings, and tax/localized pricing context. Remove display-name-based fulfillment.

### 3. Billing management and refunds

- Show current plan/status/paid-through date and payment-retry messaging; add billing portal for payment details/invoices, cancellation, and resumption.
- Preview/confirm prorated changes on the existing subscription; prevent accidental duplicate subscriptions.
- Add purchase/payment history, 14-day refund requests, and administrator review.
- Reconcile approved refunds, revoke only affected access, preserve history, and permit repurchase.
- Use scheduled/manual adjustment reconciliation because existing app notifications exclude refund events; leave both registered destinations unchanged.

### 4. Accounts and appointments

- Add name/email/password settings, confirmation-aware email changes, sign-out-all-sessions, and deletion requests with explicit active-billing handling.
- Correct signup confirmation messages, invalid recovery links, agreement loading, and return-to-purchase navigation.
- Correct lesson state/progress/resume/navigation and dashboard completion calculations. Hide purchase prompts for already-owned content.
- Offer scheduling only after verified call payment. Save confirmed appointment details and enforce one appointment per paid booking; closing the window must not fabricate a booking.
- Add reschedule/cancellation states and administrator views for payment/refund/deletion requests, catalog mappings, and reconciliation failures.
- Keep calls unavailable until appointment links and verified scheduling integration are configured.

### 5. Launch dependencies

- Draft public Terms/Privacy/Refund pages after the real legal seller name and contact details are supplied; never guess them.
- Keep live checkout unavailable until seller verification and review finish. Do not publish automatically.
- Keep membership sales unavailable until exact Key Master / Learned Master Builder / Private Mentorship content allocations are supplied.

## Technical implementation

Keep React/Vite and Lovable Cloud with the existing shared database. Add server-created checkout transactions/intents, environment-scoped subscription identities and purchased entitlements, immutable payment/adjustment history, and atomic idempotent webhook processing through parameterized operations.

Use verified sessions, protected roles, server-owned mappings, and dated access checks. Default safely to live; explicitly authorize preview test context rather than changing a shared profile tier. Preserve signature verification and server-only gateway credentials; strictly validate inputs/environments.

Document one migration convention and architecture rules in AGENTS.md. Explicit grants and RLS accompany all application tables. Add concrete business-rule tests and authenticated access-policy regression checks; verify deployed behavior rather than source alone.

## Preview testing

1. Create/sign into your own account, confirm email, accept agreements, and resume the intended purchase.
2. In **test checkout only**, use **4242 4242 4242 4242**, CVC **123**, any future expiry and any name. No real charges; never use a real card in preview.
3. Buy the course, wait for confirmed access, open paid lessons, reload, sign out, and verify paid content locks while previews remain public.
4. Start each configured tier; check exactly its assigned content. Preview/confirm upgrades/downgrades and compare prorated charges.
5. Cancel, verify paid-through date and retained access before expiry/lost access afterward; test resumption and payment-method changes.
6. Decline: **4000 0000 0000 0002**. 3DS: **4000 0000 0000 3220**. Confirm no unearned access, then test recovery and renewal. An authorized test renewal can be moved at least 30 minutes ahead.
7. Buy/schedule a call once; read back appointment date/link; test reschedule/cancel. Abandoning checkout or scheduling must not create a paid/confirmed appointment.
8. Request/approve full refund; confirm revoked access and retained history. Partial refund retains access; repurchase works.
9. Test name/email/password changes, invalid reset links, all-session sign-out, and deletion requests with active billing.
10. Test forged success URLs, altered purchase targets, direct payment-status edits, duplicate/stale events, temporary failures, and test/live isolation.

Manual card entry is required inside checkout. Automation can verify opening and app-side fulfillment, not checkout-internal card entry. Authenticated checks need your own signed-in preview account or an explicitly authorized test account; no account will be borrowed.

## Inputs still required

- Exact content for each membership tier and any higher-tier services; only one course is published today.
- Appointment URLs for the four calls and scheduling ownership/integration configuration.
- Legal seller name and policy contact details.
- A user-owned signed-in preview account.

After approval, implement all unblocked repairs and report dependent offers still disabled rather than inventing benefits, identities, or appointments.
