// Canonical payment catalog for the client.
// Keep in sync with supabase/functions/_shared/catalog.ts (server copy).

import { supabase } from '@/integrations/supabase/client';
import { getPaddleEnvironment } from '@/lib/paddle';

export interface CatalogItem {
  price_id: string;
  product_id: string;
  name: string;
  amount: number; // minor units (pence)
  currency: string;
  type: 'one_time' | 'month';
}

export const CATALOG: CatalogItem[] = [
  { price_id: 'agnotology_programme_once', product_id: 'agnotology_programme', name: 'Agnotology & Epistemic Sovereignty Programme', amount: 14900, currency: 'gbp', type: 'one_time' },
  { price_id: 'key_master_monthly', product_id: 'key_master', name: 'Key Master', amount: 2900, currency: 'gbp', type: 'month' },
  { price_id: 'learned_master_builder_monthly', product_id: 'learned_master_builder', name: 'Learned Master Builder', amount: 7900, currency: 'gbp', type: 'month' },
  { price_id: 'private_mentorship_monthly', product_id: 'private_mentorship', name: 'Private Mentorship', amount: 24900, currency: 'gbp', type: 'month' },
  { price_id: 'morpheus_express_call_once', product_id: 'morpheus_express_call', name: 'Morpheus Express Call', amount: 1500, currency: 'gbp', type: 'one_time' },
  { price_id: 'morpheus_standard_call_once', product_id: 'morpheus_standard_call', name: 'Morpheus Standard Call', amount: 2700, currency: 'gbp', type: 'one_time' },
  { price_id: 'morpheus_deep_dive_once', product_id: 'morpheus_deep_dive', name: 'Morpheus Deep Dive', amount: 4700, currency: 'gbp', type: 'one_time' },
  { price_id: 'human_expert_consultation_once', product_id: 'human_expert_consultation', name: 'Human Expert Consultation', amount: 9700, currency: 'gbp', type: 'one_time' },
];

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

// Verified course purchase check: reads the webhook-written record for the
// current environment (never trusts checkout return URLs).
export async function hasCoursePurchase(userId: string, courseId: string): Promise<boolean> {
  const { data } = await supabase
    .from('course_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('environment', getPaddleEnvironment())
    .eq('status', 'paid')
    .maybeSingle();
  return !!data;
}
