import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { gatewayFetch, type PaddleEnv } from '../_shared/paddle.ts';
import { isKnownPriceId } from '../_shared/catalog.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const priceId = typeof body?.priceId === 'string' ? body.priceId : '';
    const environment: PaddleEnv = body?.environment === 'live' ? 'live' : 'sandbox';

    if (!priceId || priceId.length > 128) {
      return new Response(JSON.stringify({ error: 'priceId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Only catalog prices can be resolved — arbitrary IDs are rejected.
    if (!isKnownPriceId(priceId)) {
      return new Response(JSON.stringify({ error: 'Unknown price' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await gatewayFetch(environment, `/prices?external_id=${encodeURIComponent(priceId)}&status=active`);
    const data = await response.json();
    if (!data?.data?.length) {
      return new Response(JSON.stringify({ error: 'Price not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ paddleId: data.data[0].id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('get-paddle-price error:', e);
    return new Response(JSON.stringify({ error: 'Failed to resolve price' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
