import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Sparkles, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  meta?: { label: string; value: string }[];
}

const STARTERS = [
  'Which lanes are losing margin?',
  'What free-time risks are open?',
  'How is SAV-07 dock utilization?',
  'Show top customer this month',
];

const INITIAL: Message = {
  id: 'm-0',
  role: 'ai',
  text:
    "Hi Ava — I can answer questions about your network. Try one of these or type anything below.",
};

// Canned, story-aligned responses based on keyword matching.
function respond(prompt: string): Message {
  const p = prompt.toLowerCase();
  const id = `m-${Date.now()}`;

  if (/(margin|profit|lane|erosion)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "3 lanes are losing margin. SAV → ATL is the largest leak — chassis fees + detention have compressed margin to 9.2%. Negotiating chassis pricing and lifting fuel surcharge by 4.2% projects $46,800/mo recovery.",
      meta: [
        { label: 'Worst lane', value: 'SAV → ATL · 9.2%' },
        { label: 'AI recovery', value: '+$46.8k/mo' },
        { label: 'Confidence', value: '92%' },
      ],
    };
  }

  if (/(free.?time|demurrage|per.?diem|container)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "5 containers at LAX are within 12h of free-time expiration — combined exposure $14,200. AI suggests combining peel-off pulls with 3 street-turn matches; projected recovery $11,800 within 18 hours.",
      meta: [
        { label: 'At-risk containers', value: '5' },
        { label: 'Exposure', value: '$14,200' },
        { label: 'Recoverable', value: '$11,800' },
      ],
    };
  }

  if (/(exception|alert|incident|risk)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "12 active exceptions, 4 critical. Top: Halcyon container free-time risk ($4k), SAV-07 dock congestion ($12.4k), Crescent Foods detention claim ($900). Avg MTTR is down 8% to 2h 14m.",
      meta: [
        { label: 'Open', value: '12' },
        { label: 'Critical', value: '4' },
        { label: 'MTTR', value: '2h 14m' },
      ],
    };
  }

  if (/(warehouse|dock|sav.?07|congestion)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "SAV-07 dock util is 88% with 6 outbound SLAs in next 4h. Two late inbounds caused the pileup. AI recommends shifting 4 outbound departures to doors 31–34 and rebalancing 2 drivers from OAK-02 standby.",
      meta: [
        { label: 'Dock util', value: '88%' },
        { label: 'SLAs at risk', value: '6' },
        { label: 'Plan', value: 'Rebalance docks 31–34' },
      ],
    };
  }

  if (/(forecast|demand|capacity|surge|peak)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "Peak-season surge detected on SAV → ATL — capacity will hit 106% by week 6. Pre-book 28 drayage slots with Atlas Intermodal and stage 2 temp sorters at SAV-07. Capex $18.4k, margin protection $94k.",
      meta: [
        { label: 'Capacity peak', value: '106% / wk 6' },
        { label: 'Recommendation', value: 'Pre-book 28 slots' },
        { label: 'Protection', value: '$94k' },
      ],
    };
  }

  if (/(customer|halcyon|crescent|account)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "Halcyon Retail Group is your largest account — 1,840 shipments MTD, $1.42M spend, 94.8% on-time vs 88% industry. Crescent Foods is the largest margin-erosion source ($38.4k last month from dwell + accessorials).",
      meta: [
        { label: 'Top customer', value: 'Halcyon · $1.42M' },
        { label: 'Top erosion', value: 'Crescent · $38.4k' },
      ],
    };
  }

  if (/(driver|dispatch|hos|street.?turn)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "8 loads can be re-optimized for $2,140 margin gain. 3 street-turns captured, 2 empties consolidated, Velasquez rerouted to MSCU7349182 for the 18:00 window. Free-time savings $4,000.",
      meta: [
        { label: 'Loads', value: '8' },
        { label: 'Margin gain', value: '+$2,140' },
        { label: 'Free-time saved', value: '$4,000' },
      ],
    };
  }

  if (/(integration|wms|tms|edi|sap|connector)/.test(p)) {
    return {
      id, role: 'ai',
      text:
        "12 integrations live, 11 healthy. CargoQuotes API is in outage (42m). Avg ingestion latency 182ms, 2.4M events processed in last 24h. SAP S/4HANA, NetSuite, Manhattan WMS, Blue Yonder TMS all green.",
      meta: [
        { label: 'Healthy', value: '11/12' },
        { label: 'Latency', value: '182ms' },
        { label: 'Events 24h', value: '2.4M' },
      ],
    };
  }

  return {
    id, role: 'ai',
    text:
      "I can help with margins, exceptions, containers, dispatch, warehouses, demand forecasting, customer health, and integration status. Try one of the suggestions to get started.",
  };
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      inputRef.current?.focus();
    });
  }, [open, messages, thinking]);

  const submit = (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { id: `m-u-${Date.now()}`, role: 'user', text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    // Simulated thinking time so the AI feels intentional.
    setTimeout(() => {
      setMessages((m) => [...m, respond(text)]);
      setThinking(false);
    }, 700 + Math.random() * 500);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 group inline-flex items-center gap-2.5 rounded-full pl-3 pr-4 h-12 bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow border border-overlay-1/20 hover:shadow-[0_0_0_1px_rgba(42,120,245,0.35),0_0_48px_-4px_rgba(42,120,245,0.5)] transition-shadow focus-ring"
            aria-label="Open Meridian AI"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-overlay-1/15 ring-1 ring-overlay-1/25">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold">Ask Meridian AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-6 right-6 z-40 w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl border border-hairline/[0.12] bg-ink-900 shadow-card overflow-hidden"
          >
            <header className="relative flex items-center justify-between gap-3 px-4 py-3 border-b border-hairline/[0.08] bg-gradient-to-r from-brand-500/10 via-violet-500/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-100 leading-tight">Meridian AI</div>
                  <div className="text-[11px] text-ink-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulseDot" />
                    Online · context-aware
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:text-ink-100 hover:bg-overlay-1/[0.06] transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <Bubble key={m.id} message={m} />
              ))}
              {thinking && <Thinking />}
              {messages.length === 1 && (
                <div className="pt-2">
                  <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold mb-2">
                    Try a question
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => submit(s)}
                        className="rounded-full border border-hairline/[0.12] bg-overlay-1/[0.03] px-2.5 py-1 text-[12px] text-ink-200 hover:bg-overlay-1/[0.06] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={onSubmit}
              className="border-t border-hairline/[0.08] p-3"
            >
              <div className="relative flex items-end rounded-xl border border-hairline/[0.12] bg-ink-950/60 focus-within:border-brand-400/60 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about margins, exceptions, containers…"
                  className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ink-100 placeholder-ink-400 outline-none max-h-32"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className={cn(
                    'm-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white transition-all',
                    input.trim() && !thinking
                      ? 'bg-brand-500 hover:bg-brand-400 shadow-glow'
                      : 'bg-ink-700 text-ink-500 cursor-not-allowed',
                  )}
                  aria-label="Send"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1.5 px-1 text-[10px] text-ink-400 flex items-center justify-between">
                <span>Shift + Enter for new line</span>
                <span>Powered by Meridian AI</span>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-white shrink-0">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
          isUser
            ? 'bg-brand-500 text-white rounded-br-sm'
            : 'bg-overlay-1/[0.04] text-ink-100 border border-hairline/[0.08] rounded-bl-sm',
        )}
      >
        <div className="whitespace-pre-wrap">{message.text}</div>
        {message.meta && (
          <div className="mt-2.5 grid grid-cols-1 gap-1.5 rounded-lg border border-hairline/[0.08] bg-ink-900 p-2">
            {message.meta.map((m) => (
              <div key={m.label} className="flex items-center justify-between text-[11px]">
                <span className="text-ink-400">{m.label}</span>
                <span className="mono text-ink-100 font-medium">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex gap-2 justify-start">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-white shrink-0">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-overlay-1/[0.04] border border-hairline/[0.08] px-3 py-2.5">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulseDot" style={{ animationDelay: '0ms' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulseDot" style={{ animationDelay: '180ms' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulseDot" style={{ animationDelay: '360ms' }} />
        </div>
      </div>
    </div>
  );
}
