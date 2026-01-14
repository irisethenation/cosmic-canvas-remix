import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
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

// Morpheus AI response (text-based agent)
async function getMorpheusResponse(userMessage: string, caseHistory: any[]): Promise<string> {
  // Build context from case history
  const historyContext = caseHistory
    .slice(-10)
    .map(m => `${m.sender}: ${m.content}`)
    .join('\n');
  
  const systemPrompt = `You are Morpheus, a wise and calm AI support agent for a learning platform. 
You speak with measured confidence and use metaphors about awakening, choice, and potential.
You help users with:
- Course navigation and content questions
- Technical issues with the platform
- Subscription and billing inquiries
- General learning guidance

If the issue requires human escalation or voice support, suggest connecting to Trinity (voice agent).
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
    console.error('AI error:', error);
    return "The Matrix is experiencing interference. Please try again in a moment.";
  }
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

// Main handler
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const update = await req.json();
    console.log('Telegram update received:', JSON.stringify(update).substring(0, 500));
    
    // Handle message updates
    if (update.message) {
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
