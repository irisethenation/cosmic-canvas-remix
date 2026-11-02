// Canonical payment catalog shared by server-side functions.
// Keep in sync with src/lib/catalog.ts (client copy).

export const COURSE_PRICE_IDS = ['agnotology_programme_once'] as const;

export const SUBSCRIPTION_PRICE_IDS = [
  'key_master_monthly',
  'learned_master_builder_monthly',
  'private_mentorship_monthly',
] as const;

export const CALL_PRICE_IDS = [
  'morpheus_express_call_once',
  'morpheus_standard_call_once',
  'morpheus_deep_dive_once',
  'human_expert_consultation_once',
] as const;

export const ALL_PRICE_IDS: ReadonlySet<string> = new Set([
  ...COURSE_PRICE_IDS,
  ...SUBSCRIPTION_PRICE_IDS,
  ...CALL_PRICE_IDS,
]);

export function isKnownPriceId(priceId: string): boolean {
  return ALL_PRICE_IDS.has(priceId);
}
