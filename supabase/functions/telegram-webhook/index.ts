import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_WEBHOOK_SECRET = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Send message via Telegram
async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: any) {
  const payload: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  };
  if (replyMarkup) {
    payload.reply_markup = JSON.stringify(replyMarkup);
  }
  
  console.log(`Sending message to chat ${chatId}:`, text.substring(0, 100));
  
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  const result = await response.json();
  if (!result.ok) {
    console.error('Telegram API error:', result);
  }
  return result;
}

// Get or create support case for chat
async function getOrCreateCase(chatId: number, userId: number, username?: string) {
  // Check for existing active case
  const { data: existingCase } = await supabase
    .from('support_cases')
    .select('*')
    .eq('telegram_chat_id', chatId)
    .in('status', ['active', 'escalated'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (existingCase) {
    console.log(`Found existing case: ${existingCase.id}`);
    return existingCase;
  }
  
  // Create new case
  const { data: newCase, error } = await supabase
    .from('support_cases')
    .insert({
      telegram_chat_id: chatId,
      telegram_user_id: userId,
      telegram_username: username,
      current_agent: 'morpheus',
      status: 'active',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating case:', error);
    throw error;
  }
  
  console.log(`Created new case: ${newCase.id}`);
  return newCase;
}

// Log message to database
async function logMessage(caseId: string, sender: string, content: string, messageId?: number, messageType = 'text', metadata = {}) {
  const { error } = await supabase
    .from('case_messages')
    .insert({
      case_id: caseId,
      telegram_message_id: messageId,
      sender,
      content,
      message_type: messageType,
      metadata,
    });
  
  if (error) {
    console.error('Error logging message:', error);
  }
}

// Trinity AI response (onboarding/re-engagement agent)
async function getTrinityResponse(userMessage: string, caseHistory: any[], userContext: any): Promise<string> {
  const historyContext = caseHistory
    .slice(-10)
    .map(m => `${m.sender}: ${m.content}`)
    .join('\n');
  
  const systemPrompt = `You are Trinity, a warm and compassionate AI guide for the iRise Academy learning platform.
Your role is onboarding new students, re-engaging inactive learners, and providing gentle guidance.
Your signature sign-off is "Peace and Balance."

Tone guidelines:
- Warm, relatable, encouraging
- Never pressuring or salesy
- Empathetic and understanding
- Focus on their learning journey, not pushing products

You help users with:
- Getting started with the platform
- Understanding subscription options (explain value, not hard sell)
- Re-engaging after inactivity
- Navigating their first steps
- Answering general questions about the academy

User context:
- Has subscription: ${userContext.hasSubscription ? 'Yes' : 'No'}
- Tier: ${userContext.tier || 'None'}
- Days since last activity: ${userContext.daysSinceActivity || 'N/A'}

Recent conversation:
${historyContext}

Remember to end important messages with "Peace and Balance." but not every message.`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm here to help. Could you tell me more about what you're looking for? Peace and Balance.";
  } catch (error) {
    console.error('Trinity AI error:', error);
    return "I'm experiencing a brief moment of reflection. Please try again. Peace and Balance.";
  }
}

// Morpheus AI response (text-based agent)
async function getMorpheusResponse(userMessage: string, caseHistory: any[]): Promise<string> {
  const historyContext = caseHistory
    .slice(-10)
    .map(m => `${m.sender}: ${m.content}`)
    .join('\n');
  
  const systemPrompt = `You are Morpheus, a wise and calm AI support agent for the iRise Academy learning platform. 
You speak with measured confidence and use metaphors about awakening, choice, and potential.
Your tone is professional, precise, calm, and authoritative.

You help users with:
- Course navigation and content questions
- Technical issues with the platform
- Subscription and billing inquiries
- General learning guidance
- Trust and advocacy matters

If the issue requires human escalation or compassionate onboarding support, suggest connecting to Trinity.
If the user seems new or overwhelmed, consider suggesting /trinity for a gentler introduction.
Keep responses concise but helpful. Use occasional Matrix references naturally.

Recent conversation:
${historyContext}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I sense a disturbance in the Matrix. Please try again.";
  } catch (error) {
    console.error('Morpheus AI error:', error);
    return "The Matrix is experiencing interference. Please try again in a moment.";
  }
}

// Classify intent to determine agent routing
async function classifyIntent(message: string): Promise<{ caseType: string; suggestedAgent: string }> {
  const lowerMessage = message.toLowerCase();
  
  // Onboarding signals
  if (lowerMessage.includes('new') || lowerMessage.includes('start') || lowerMessage.includes('begin') || 
      lowerMessage.includes('join') || lowerMessage.includes('sign up') || lowerMessage.includes('how do i')) {
    return { caseType: 'ONBOARDING', suggestedAgent: 'trinity' };
  }
  
  // Billing/subscription signals
  if (lowerMessage.includes('payment') || lowerMessage.includes('billing') || lowerMessage.includes('subscription') ||
      lowerMessage.includes('cancel') || lowerMessage.includes('refund') || lowerMessage.includes('price')) {
    return { caseType: 'BILLING', suggestedAgent: 'morpheus' };
  }
  
  // Trust/advocacy signals
  if (lowerMessage.includes('trust') || lowerMessage.includes('advocacy') || lowerMessage.includes('legal') ||
      lowerMessage.includes('document') || lowerMessage.includes('compliance')) {
    return { caseType: 'TRUST_ONBOARDING', suggestedAgent: 'morpheus' };
  }
  
  // Tech support signals
  if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('broken') ||
      lowerMessage.includes('not working') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
    return { caseType: 'TECH_SUPPORT', suggestedAgent: 'morpheus' };
  }
  
  // Default to academy support with Morpheus
  return { caseType: 'ACADEMY_SUPPORT', suggestedAgent: 'morpheus' };
}

// Get user context for Trinity
async function getUserContext(telegramUserId: number): Promise<any> {
  // Try to find linked user by telegram_user_id in support_cases
  const { data: cases } = await supabase
    .from('support_cases')
    .select('user_id')
    .eq('telegram_user_id', telegramUserId)
    .not('user_id', 'is', null)
    .limit(1);
  
  if (!cases || cases.length === 0 || !cases[0].user_id) {
    return { hasSubscription: false, tier: null, daysSinceActivity: null };
  }
  
  const userId = cases[0].user_id;
  
  // Get subscription info
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier_key, status')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .limit(1)
    .single();
  
  return {
    hasSubscription: !!subscription,
    tier: subscription?.tier_key || null,
    daysSinceActivity: null, // Could calculate from lesson_progress
  };
}

// Handle /start command
async function handleStart(chatId: number, userId: number, username?: string) {
  const supportCase = await getOrCreateCase(chatId, userId, username);
  
  const welcomeMessage = `🕶️ <b>Welcome to the Matrix, ${username || 'Neo'}.</b>

I am <b>Morpheus</b>, your guide through this learning journey.

You've taken the first step by reaching out. Now, the question is: what do you seek?

<b>Available Commands:</b>
/help - Show available options
/trinity - Connect to Trinity (voice support)
/status - Check your support case status
/close - Close current support case

Simply type your question or concern, and I will guide you.`;

  await sendTelegramMessage(chatId, welcomeMessage);
  await logMessage(supportCase.id, 'morpheus', welcomeMessage, undefined, 'text');
}

// Handle /trinity command - escalate to voice
async function handleTrinityEscalation(chatId: number, caseId: string) {
  // Update case status
  await supabase
    .from('support_cases')
    .update({ current_agent: 'trinity', status: 'escalated' })
    .eq('id', caseId);
  
  const trinityMessage = `📞 <b>Connecting you to Trinity...</b>

Trinity is our voice support specialist. She'll call you shortly.

<i>Note: Voice support requires Vapi integration. If you don't receive a call within 2 minutes, please use /morpheus to return to text support.</i>`;

  await sendTelegramMessage(chatId, trinityMessage);
  await logMessage(caseId, 'system', 'User requested Trinity (voice) escalation', undefined, 'command');
  
  // TODO: Trigger Vapi outbound call here when integrated
  console.log('Trinity escalation requested for case:', caseId);
}

// Handle /morpheus command - return to text
async function handleMorpheusReturn(chatId: number, caseId: string) {
  await supabase
    .from('support_cases')
    .update({ current_agent: 'morpheus', status: 'active' })
    .eq('id', caseId);
  
  const returnMessage = `🕶️ <b>Welcome back.</b>

I am here. What troubles you?`;

  await sendTelegramMessage(chatId, returnMessage);
  await logMessage(caseId, 'system', 'User returned to Morpheus (text)', undefined, 'command');
}

// Handle /close command
async function handleClose(chatId: number, caseId: string) {
  await supabase
    .from('support_cases')
    .update({ status: 'closed' })
    .eq('id', caseId);
  
  const closeMessage = `✅ <b>Support case closed.</b>

Remember: There is no spoon. But there is always /start when you need guidance again.

Until we meet again. 🕶️`;

  await sendTelegramMessage(chatId, closeMessage);
  await logMessage(caseId, 'system', 'Case closed by user', undefined, 'command');
}

// Handle /status command
async function handleStatus(chatId: number, caseId: string, currentAgent: string, status: string) {
  const statusMessage = `📊 <b>Support Case Status</b>

🆔 Case ID: <code>${caseId.substring(0, 8)}...</code>
🤖 Current Agent: <b>${currentAgent === 'morpheus' ? 'Morpheus (Text)' : 'Trinity (Voice)'}</b>
📌 Status: <b>${status.charAt(0).toUpperCase() + status.slice(1)}</b>

Need to switch agents?
/trinity - Voice support
/morpheus - Text support`;

  await sendTelegramMessage(chatId, statusMessage);
}

// Handle /help command
async function handleHelp(chatId: number) {
  const helpMessage = `🕶️ <b>Morpheus Command Center</b>

<b>Navigation:</b>
/start - Begin a new conversation
/help - Show this help message
/status - Check your case status

<b>Agent Selection:</b>
/trinity - Connect to voice support
/morpheus - Return to text support

<b>Actions:</b>
/close - Close your support case

Or simply type your question and I will assist you.`;

  await sendTelegramMessage(chatId, helpMessage);
}

// Main message handler
async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const username = message.from.username;
  const text = message.text || '';
  const messageId = message.message_id;
  
  console.log(`Received message from ${username || userId}: ${text.substring(0, 100)}`);
  
  // Handle commands
  if (text.startsWith('/')) {
    const command = text.split(' ')[0].toLowerCase();
    
    if (command === '/start') {
      return await handleStart(chatId, userId, username);
    }
    
    if (command === '/help') {
      return await handleHelp(chatId);
    }
    
    // Commands that need an active case
    const supportCase = await getOrCreateCase(chatId, userId, username);
    
    switch (command) {
      case '/trinity':
        return await handleTrinityEscalation(chatId, supportCase.id);
      case '/morpheus':
        return await handleMorpheusReturn(chatId, supportCase.id);
      case '/close':
        return await handleClose(chatId, supportCase.id);
      case '/status':
        return await handleStatus(chatId, supportCase.id, supportCase.current_agent, supportCase.status);
      default:
        await sendTelegramMessage(chatId, "Unknown command. Use /help to see available options.");
    }
    return;
  }
  
  // Regular message - get case and respond with Morpheus
  const supportCase = await getOrCreateCase(chatId, userId, username);
  
  // Log user message
  await logMessage(supportCase.id, 'user', text, messageId, 'text');
  
  // Get message history for context
  const { data: history } = await supabase
    .from('case_messages')
    .select('sender, content')
    .eq('case_id', supportCase.id)
    .order('created_at', { ascending: true })
    .limit(20);
  
  // Get AI response
  const aiResponse = await getMorpheusResponse(text, history || []);
  
  // Send and log response
  await sendTelegramMessage(chatId, aiResponse);
  await logMessage(supportCase.id, 'morpheus', aiResponse, undefined, 'text');
}

// Validate Telegram update structure
function validateTelegramUpdate(update: any): boolean {
  if (!update || typeof update !== 'object') return false;
  
  if (update.message) {
    const msg = update.message;
    if (!msg.chat?.id || !msg.from?.id) return false;
    if (msg.text && typeof msg.text !== 'string') return false;
    // Limit text length to prevent abuse
    if (msg.text && msg.text.length > 4000) return false;
  }
  
  if (update.callback_query) {
    const cbq = update.callback_query;
    if (!cbq.from?.id) return false;
  }
  
  return true;
}

// Sanitize text input
function sanitizeText(text: string): string {
  return text.substring(0, 4000).trim();
}

// Main handler
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Verify Telegram secret token (critical security check)
  if (TELEGRAM_WEBHOOK_SECRET) {
    const secretToken = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (!secretToken || secretToken !== TELEGRAM_WEBHOOK_SECRET) {
      console.error('Unauthorized webhook request - invalid or missing secret token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.warn('TELEGRAM_WEBHOOK_SECRET not configured - webhook security is reduced');
  }
  
  try {
    const update = await req.json();
    
    // Validate update structure
    if (!validateTelegramUpdate(update)) {
      console.error('Invalid Telegram update structure');
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('Telegram update received:', JSON.stringify(update).substring(0, 500));
    
    // Handle message updates
    if (update.message) {
      // Sanitize text before processing
      if (update.message.text) {
        update.message.text = sanitizeText(update.message.text);
      }
      await handleMessage(update.message);
    }
    
    // Handle callback queries (for inline buttons)
    if (update.callback_query) {
      console.log('Callback query:', update.callback_query);
      // TODO: Handle callback queries for inline buttons
    }
    
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    // Return generic error message to prevent information leakage
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
