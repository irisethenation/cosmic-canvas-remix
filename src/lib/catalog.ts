// Canonical payment catalog for the client.
// Keep in sync with supabase/functions/_shared/catalog.ts (server copy).

export const COURSE_PRICE_ID = 'agnotology_programme_once';
export const COURSE_PRICE_LABEL = '£149';

export const SUBSCRIPTION_PLANS = [
  { name: 'Key Master', priceLabel: '£29/mo', priceId: 'key_master_monthly', tier: 1 },
  { name: 'Learned Master Builder', priceLabel: '£79/mo', priceId: 'learned_master_builder_monthly', tier: 2 },
  { name: 'Private Mentorship', priceLabel: '£249/mo', priceId: 'private_mentorship_monthly', tier: 3 },
] as const;

export const TIER_KEY_TO_TIER: Record<string, number> = {
  TIER_1_KEY_MASTER: 1,
  TIER_2_LEARNED_MASTER_BUILDER: 2,
  TIER_3_PRIVATE_MENTORSHIP: 3,
};

// Map call products (by name in paid_call_products) to their checkout price IDs.
export const CALL_PRICE_BY_NAME: Record<string, string> = {
  'Morpheus Express Call': 'morpheus_express_call_once',
  'Morpheus Standard Call': 'morpheus_standard_call_once',
  'Morpheus Deep Dive': 'morpheus_deep_dive_once',
  'Human Expert Consultation': 'human_expert_consultation_once',
};
