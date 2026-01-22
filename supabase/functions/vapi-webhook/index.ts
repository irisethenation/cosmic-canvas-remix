import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vapi-secret',
};

const VAPI_WEBHOOK_SECRET = Deno.env.get('VAPI_WEBHOOK_SECRET');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Log telemetry event
async function logTelemetry(source: string, level: string, eventKey: string, payload: any, caseId?: string) {
  await supabase.from('telemetry').insert({
    source,
    level,
    event_key: eventKey,
    payload,
    case_id: caseId,
  });
}

// Create or update call record
async function upsertCall(callId: string, data: any) {
  const { data: existing } = await supabase
    .from('calls')
    .select('id')
    .eq('vapi_call_id', callId)
    .single();
  
  if (existing) {
    await supabase.from('calls').update(data).eq('vapi_call_id', callId);
  } else {
    await supabase.from('calls').insert({ vapi_call_id: callId, ...data });
  }
}

// Create support case for call
async function createCallSupportCase(callData: any): Promise<string> {
  const { data: newCase } = await supabase
    .from('support_cases')
    .insert({
      channel: 'VAPI_VOICE',
      case_type: callData.caseType || 'ACADEMY_SUPPORT',
      priority: 'NORMAL',
      current_agent: 'morpheus',
      status: 'active',
      summary: callData.summary || 'Inbound voice call',
      vapi_call_id: callData.callId,
    })
    .select()
    .single();
  
  return newCase?.id;
}

// Main menu response
function getMainMenuResponse() {
  return {
    message: `Welcome to iRise Academy and Legacy Trust Foundation. 
    
For education and admissions, press 1 or say "education".
For advocacy support, press 2 or say "advocacy".
To update your trust or file compliance documents, press 3 or say "trust".
For general iRise Nation information, press 4 or say "general".

Please note: This call may be recorded for quality and training purposes. By continuing, you consent to recording.`,
    options: [
      { digit: '1', intent: 'academy', label: 'Education & Admissions' },
      { digit: '2', intent: 'advocacy', label: 'Advocacy Support' },
      { digit: '3', intent: 'trust', label: 'Trust & Compliance' },
      { digit: '4', intent: 'general', label: 'General Information' },
    ],
  };
}

// Academy sub-menu
function getAcademySubMenu() {
  return {
    message: `For our privacy policy and code of conduct, press 1.
For available courses and programs, press 2.
To speak with a course ambassador, press 3.
To return to the main menu, press 0.`,
    options: [
      { digit: '1', intent: 'privacy_conduct', label: 'Privacy & Conduct' },
      { digit: '2', intent: 'courses', label: 'Courses & Programs' },
      { digit: '3', intent: 'ambassador', label: 'Speak to Ambassador' },
      { digit: '0', intent: 'main_menu', label: 'Main Menu' },
    ],
  };
}

// Handle different Vapi event types
async function handleVapiEvent(event: any) {
  const eventType = event.type || event.event;
  const callId = event.call?.id || event.callId;
  
  console.log(`Vapi event: ${eventType}, call: ${callId}`);
  
  switch (eventType) {
    case 'call.started':
    case 'call-start': {
      await upsertCall(callId, {
        provider: 'VAPI',
        direction: event.call?.direction || 'INBOUND',
        status: 'IN_PROGRESS',
        phone_number: event.call?.customer?.number,
        started_at: new Date().toISOString(),
        consent_confirmed: false,
      });
      
      await logTelemetry('VAPI', 'INFO', 'call_started', { callId, phone: event.call?.customer?.number });
      
      // Return greeting and menu
      return {
        type: 'response',
        response: getMainMenuResponse().message,
      };
    }
    
    case 'call.ended':
    case 'call-end': {
      await upsertCall(callId, {
        status: 'COMPLETED',
        ended_at: new Date().toISOString(),
        duration_seconds: event.call?.duration || event.durationSeconds,
        transcript: event.transcript || event.call?.transcript,
        recording_url: event.recordingUrl || event.call?.recordingUrl,
      });
      
      await logTelemetry('VAPI', 'INFO', 'call_ended', { 
        callId, 
        duration: event.call?.duration,
        hasTranscript: !!(event.transcript || event.call?.transcript),
      });
      
      return { type: 'ack' };
    }
    
    case 'transcript':
    case 'conversation-update': {
      // Handle real-time transcript updates
      if (event.transcript) {
        await logTelemetry('VAPI', 'INFO', 'transcript_update', {
          callId,
          role: event.role,
          content: event.transcript?.substring(0, 200),
        });
      }
      return { type: 'ack' };
    }
    
    case 'function-call': {
      // Handle tool/function calls from Vapi
      const functionName = event.functionCall?.name;
      const parameters = event.functionCall?.parameters || {};
      
      console.log(`Function call: ${functionName}`, parameters);
      
      switch (functionName) {
        case 'get_menu':
          return {
            type: 'function-result',
            result: getMainMenuResponse(),
          };
        
        case 'handle_menu_selection':
          const selection = parameters.selection || parameters.digit;
          if (selection === '1') {
            return {
              type: 'function-result',
              result: getAcademySubMenu(),
            };
          }
          return {
            type: 'function-result',
            result: { message: 'Thank you for your selection. A team member will follow up shortly.' },
          };
        
        case 'create_support_case':
          const caseId = await createCallSupportCase({
            callId,
            caseType: parameters.case_type,
            summary: parameters.summary,
          });
          return {
            type: 'function-result',
            result: { success: true, caseId },
          };
        
        case 'confirm_consent':
          await upsertCall(callId, { consent_confirmed: true });
          return {
            type: 'function-result',
            result: { message: 'Thank you for confirming. How may I assist you today?' },
          };
        
        default:
          return {
            type: 'function-result',
            result: { error: 'Unknown function' },
          };
      }
    }
    
    case 'status-update': {
      await logTelemetry('VAPI', 'INFO', 'status_update', {
        callId,
        status: event.status,
      });
      return { type: 'ack' };
    }
    
    case 'error': {
      await logTelemetry('VAPI', 'ERROR', 'call_error', {
        callId,
        error: event.error,
      });
      await upsertCall(callId, { status: 'FAILED' });
      return { type: 'ack' };
    }
    
    default:
      console.log('Unhandled Vapi event type:', eventType);
      return { type: 'ack' };
  }
}

// Main handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Verify Vapi webhook secret if configured
  if (VAPI_WEBHOOK_SECRET) {
    const secretHeader = req.headers.get('x-vapi-secret');
    if (!secretHeader || secretHeader !== VAPI_WEBHOOK_SECRET) {
      console.error('Unauthorized Vapi webhook request');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
  
  try {
    const event = await req.json();
    console.log('Vapi webhook received:', JSON.stringify(event).substring(0, 500));
    
    const result = await handleVapiEvent(event);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Vapi webhook error:', error);
    await logTelemetry('VAPI', 'ERROR', 'webhook_error', { error: String(error) });
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
