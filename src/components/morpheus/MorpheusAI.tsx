import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Scale,
  MessageSquare,
  User,
  Gavel,
  ShieldAlert,
  Users,
  BrainCircuit,
  Send,
  RefreshCw,
  ChevronDown
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Morpheus Mode Definitions
// ─────────────────────────────────────────────────────────────

export type MorpheusMode =
  | 'socratic'
  | 'coach'
  | 'judge'
  | 'prosecutor'
  | 'jury';

interface ModeConfig {
  id: MorpheusMode;
  label: string;
  icon: React.ElementType;
  colour: string;          // Tailwind bg colour token
  badgeColour: string;     // Badge class
  description: string;
  systemPrompt: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'socratic',
    label: 'Socratic Tutor',
    icon: BrainCircuit,
    colour: 'bg-violet-900/30 border-violet-700',
    badgeColour: 'bg-violet-800 text-violet-100',
    description: 'Never gives the answer — asks the question that leads you there.',
    systemPrompt: `You are Morpheus, the Socratic tutor for iRise Litigation Academy.
Your role is to never simply answer a student's question. Instead, respond with one or two targeted
Socratic questions that guide the student to discover the answer themselves.

Rules:
- Ask questions, do not lecture
- Keep responses concise (2–4 sentences max)
- Each question should probe one specific concept
- If the student gives a correct answer, acknowledge it briefly and probe deeper
- Reference iRise Academy materials and real case law when relevant
- Maintain an intellectually rigorous but encouraging tone
- Educational purposes only — remind students this is not legal advice`,
  },
  {
    id: 'coach',
    label: 'Litigation Coach',
    icon: Scale,
    colour: 'bg-emerald-900/30 border-emerald-700',
    badgeColour: 'bg-emerald-800 text-emerald-100',
    description: 'Senior trial counsel — critiques your arguments and advocacy.',
    systemPrompt: `You are Morpheus, acting as a Senior Trial Counsel coaching an iRise Academy student.
You are a tough but fair litigation coach with 30+ years of courtroom experience.

Your role:
- Review the student's legal arguments, motions, or statements
- Provide specific, actionable critique
- Point out exactly what would fail in a real courtroom and why
- Suggest improvements with precision
- Challenge weak arguments: "That won't fly because..."
- Praise strong arguments specifically: "That's effective because..."
- Reference the Federal Rules of Evidence, relevant case law, and procedural rules
- Keep critique focused on craft, not the person
- Educational purposes only — this is training, not legal advice`,
  },
  {
    id: 'judge',
    label: 'Judge Mode',
    icon: Gavel,
    colour: 'bg-amber-900/30 border-amber-700',
    badgeColour: 'bg-amber-800 text-amber-100',
    description: 'The Honourable Morpheus — interrupts, rules, asks questions from the bench.',
    systemPrompt: `You are Morpheus, acting as a traffic court judge during a simulated hearing.
Character: You are fair, impatient with poor preparation, and demanding of precision.

Your role:
- Interrupt the student (counsel) when arguments are unclear or unsupported
- Ask pointed questions from the bench: "Counsel, what authority do you have for that proposition?"
- Rule on objections concisely: "Sustained." or "Overruled." with brief reasoning
- Push back on weak arguments
- Issue rulings with explanation
- Stay strictly in character as a judge — speak in judicial tone
- After each exchange, optionally add [COACH NOTE: ...] with one teaching point
- Educational simulation only — not legal advice`,
  },
  {
    id: 'prosecutor',
    label: 'Prosecutor Mode',
    icon: ShieldAlert,
    colour: 'bg-red-900/30 border-red-700',
    badgeColour: 'bg-red-800 text-red-100',
    description: 'State Attorney — cross-examines, raises objections, tests your weaknesses.',
    systemPrompt: `You are Morpheus, acting as the State Attorney prosecuting a traffic citation case.
Character: You are skilled, thorough, and know exactly how to defend the prosecution's case.

Your role:
- Cross-examine the student (defendant or defence counsel) aggressively but professionally
- Raise objections to their arguments: "Objection, Your Honour — no foundation"
- Present the prosecution's best arguments
- Challenge the reliability of the student's evidence
- Identify and attack inconsistencies
- Use real legal standards: preponderance of evidence, foundation requirements, hearsay rules
- Stay in character throughout
- After exchanges, optionally add [COACH NOTE: ...] with one teaching point
- Educational simulation only — not legal advice`,
  },
  {
    id: 'jury',
    label: 'Jury Mode',
    icon: Users,
    colour: 'bg-sky-900/30 border-sky-700',
    badgeColour: 'bg-sky-800 text-sky-100',
    description: 'Post-trial juror — explains what convinced them and what lost credibility.',
    systemPrompt: `You are Morpheus, acting as a juror who just deliberated in a traffic citation case.
Character: You are an ordinary person — thoughtful, not a lawyer — who must explain your verdict reasoning.

Your role:
- Explain what evidence convinced you and why, in plain language
- Explain what evidence you found unconvincing and why
- Be honest about what you found confusing or unclear
- Identify which arguments "felt" credible vs. those that seemed like legal tricks
- Speak as a juror, not a lawyer: "I wasn't convinced because..." not "The evidentiary standard..."
- Ask questions the student should have addressed: "Nobody ever explained why..."
- After explaining, optionally add [COACH NOTE: ...] with one litigation lesson
- Educational simulation only — not legal advice`,
  },
];

// ─────────────────────────────────────────────────────────────
// Message Types
// ─────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'morpheus';
  content: string;
  timestamp: Date;
  mode: MorpheusMode;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

interface MorpheusAIProps {
  defaultMode?: MorpheusMode;
  lessonContext?: string;   // Injected from the current lesson
  className?: string;
}

const MorpheusAI = ({
  defaultMode = 'socratic',
  lessonContext = '',
  className = '',
}: MorpheusAIProps) => {
  const [activeMode, setActiveMode] = useState<MorpheusMode>(defaultMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentMode = MODES.find(m => m.id === activeMode)!;
  const ModeIcon = currentMode.icon;

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Greeting on mode change
  useEffect(() => {
    const greetings: Record<MorpheusMode, string> = {
      socratic: "I am Morpheus, your Socratic guide. I don't give answers — I ask better questions. What is on your mind from this lesson?",
      coach: "I am Morpheus — Senior Trial Counsel. You have thirty seconds to brief me on your case theory. Go.",
      judge: "This court is in session. Counsel, you may begin. And I warn you — I will interrupt if I need to.",
      prosecutor: "Good morning. I am ready for cross-examination. Defendant, please state your version of events.",
      jury: "We have reached our verdict. I'm happy to explain what convinced us — and what didn't.",
    };
    setMessages([
      {
        id: `greeting-${activeMode}`,
        role: 'morpheus',
        content: greetings[activeMode],
        timestamp: new Date(),
        mode: activeMode,
      },
    ]);
  }, [activeMode]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      mode: activeMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .slice(-8) // last 8 messages for context window
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

      // Combine system prompt with lesson context
      const systemContent = [
        currentMode.systemPrompt,
        lessonContext
          ? `\n\nCurrent lesson context:\n${lessonContext}`
          : '',
        '\n\nIMPORTANT: This is an educational simulation for iRise Academy students learning litigation fundamentals. Always end responses with "For educational purposes only — not legal advice" where appropriate.',
      ]
        .filter(Boolean)
        .join('');

      const response = await fetch('/api/morpheus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          systemPrompt: systemContent,
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMsg.content },
          ],
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const morpheusContent =
        data.content?.[0]?.text ?? data.reply ?? 'No response received.';

      const morpheusMsg: Message = {
        id: `morpheus-${Date.now()}`,
        role: 'morpheus',
        content: morpheusContent,
        timestamp: new Date(),
        mode: activeMode,
      };

      setMessages(prev => [...prev, morpheusMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'morpheus',
          content:
            'I am temporarily unavailable. Review the lesson materials and try again shortly.',
          timestamp: new Date(),
          mode: activeMode,
        },
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    // Re-trigger greeting
    setActiveMode(prev => {
      setTimeout(() => setActiveMode(prev), 10);
      return prev;
    });
  };

  return (
    <div className={`flex flex-col rounded-xl border ${currentMode.colour} transition-all duration-300 ${className}`}>
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ModeIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Morpheus AI</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${currentMode.badgeColour}`}>
              {currentMode.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            className="text-white/60 hover:text-white hover:bg-white/10"
            title="New conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowModes(!showModes)}
            className="text-white/60 hover:text-white hover:bg-white/10 flex items-center gap-1"
          >
            <span className="text-xs">Switch Mode</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showModes ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* ── Mode Selector ──────────────────────────────── */}
      {showModes && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border-b border-white/10 bg-black/20">
          {MODES.map(mode => {
            const Icon = mode.icon;
            const isActive = mode.id === activeMode;
            return (
              <button
                key={mode.id}
                onClick={() => { setActiveMode(mode.id); setShowModes(false); }}
                className={`flex flex-col items-start p-2 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'border-white/40 bg-white/15'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-medium text-white">{mode.label}</span>
                </div>
                <p className="text-[10px] text-white/50 leading-tight">{mode.description}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Messages ──────────────────────────────────── */}
      <ScrollArea className="flex-1 min-h-[280px] max-h-[420px]" ref={scrollRef as any}>
        <div className="flex flex-col gap-3 p-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'morpheus' && (
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ModeIcon className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-white/20 text-white rounded-tr-sm'
                    : 'bg-black/30 text-white/90 rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <ModeIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-black/30 rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 150, 300].map(d => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ── Input ─────────────────────────────────────── */}
      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeMode === 'socratic'
                ? 'Ask a question or share your thinking…'
                : activeMode === 'coach'
                ? 'Present your argument for review…'
                : activeMode === 'judge'
                ? 'Address the court…'
                : activeMode === 'prosecutor'
                ? 'State your position or answer the question…'
                : 'Ask the juror what they thought…'
            }
            className="min-h-[60px] max-h-[120px] resize-none bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-10 w-10 flex-shrink-0 bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-white/30 mt-1.5 text-center">
          For educational purposes only — not legal advice · Press Enter to send
        </p>
      </div>
    </div>
  );
};

export default MorpheusAI;
