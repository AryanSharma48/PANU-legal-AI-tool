import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

// ─── Types ──
interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

// ─── SVG Icon Components (no external dependency) ──
const MessageSquareIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const XIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const SendIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

const ScaleIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);

// Bouncing Dots Loader 
const BouncingDots: React.FC = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-regal-500"
        style={{
          animation: 'chatbot-bounce 1.4s infinite ease-in-out both',
          animationDelay: `${i * 0.16}s`,
        }}
      />
    ))}
  </div>
);

// ─── API Config ──────────────────────────────────────────────────────────────
const API_URL = 'http://localhost:5000';

// ─── Main Component ──────────────────────────────────────────────────────────
const LegalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus textarea when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node)
      ) {
        // Don't close if clicking the toggle button itself
        const toggleBtn = document.getElementById('legal-chatbot-toggle');
        if (toggleBtn && toggleBtn.contains(e.target as Node)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Auto-resize textarea
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  // Send message
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      const aiMsg: ChatMessage = {
        role: 'ai',
        content: data.reply || 'No response received.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: 'ai',
        content:
          'I apologize, but I am unable to process your request at this time. Please try again shortly or consult a qualified legal professional.',
      };
      setMessages((prev) => [...prev, errorMsg]);
      console.error('Chat API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <>
      {/*Keyframe Styles*/}
      <style>{`
        @keyframes chatbot-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes chatbot-slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatbot-fade-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(16px) scale(0.95); }
        }
        .chatbot-enter {
          animation: chatbot-slide-up 0.25s ease-out forwards;
        }
        .chatbot-exit {
          animation: chatbot-fade-out 0.2s ease-in forwards;
        }
        .chatbot-markdown p { margin-bottom: 0.5em; }
        .chatbot-markdown p:last-child { margin-bottom: 0; }
        .chatbot-markdown ul, .chatbot-markdown ol { margin: 0.4em 0; padding-left: 1.4em; }
        .chatbot-markdown li { margin-bottom: 0.2em; }
        .chatbot-markdown h1, .chatbot-markdown h2, .chatbot-markdown h3 {
          font-weight: 700; margin: 0.6em 0 0.3em;
        }
        .chatbot-markdown h1 { font-size: 1.15em; }
        .chatbot-markdown h2 { font-size: 1.05em; }
        .chatbot-markdown h3 { font-size: 1em; }
        .chatbot-markdown strong { font-weight: 700; }
        .chatbot-markdown em { font-style: italic; }
        .chatbot-markdown code {
          background: rgba(197,160,89,0.1); padding: 0.1em 0.35em;
          border-radius: 3px; font-size: 0.9em; font-family: monospace;
        }
        .chatbot-markdown pre {
          background: #1a1a1a; color: #f0f0f0; padding: 0.7em;
          border-radius: 6px; overflow-x: auto; margin: 0.5em 0;
          font-size: 0.85em;
        }
        .chatbot-markdown pre code { background: none; padding: 0; color: inherit; }
        .chatbot-markdown blockquote {
          border-left: 3px solid rgba(197,160,89,0.4);
          padding-left: 0.75em; margin: 0.4em 0; color: #614c2e; font-style: italic;
        }
        .chatbot-markdown hr { border: none; border-top: 1px solid rgba(197,160,89,0.3); margin: 0.6em 0; }
        .chatbot-markdown a { color: #91713c; text-decoration: underline; }
      `}</style>

      {/* ── Floating Toggle Button ───────────────────────────────────── */}
      <button
        id="legal-chatbot-toggle"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-regal-800 text-regal-100 shadow-lg hover:bg-regal-900 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        aria-label={isOpen ? 'Close AI Legal Assistant' : 'Open AI Legal Assistant'}
        title="AI Legal Assistant"
      >
        {isOpen ? (
          <XIcon size={22} className="transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <ScaleIcon size={22} className="transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>

      {/* ── Chat Window ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="chatbot-enter fixed bottom-24 right-6 z-[9998] w-[370px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-xl shadow-2xl border border-regal-200 overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, #fdfaf5, #f9f5ed)' }}
          role="dialog"
          aria-label="AI Legal Assistant Chat"
        >
          {/* ── Header ──── */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-regal-800 text-regal-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-regal-600 flex items-center justify-center">
                <ScaleIcon size={16} />
              </div>
              <div>
                <h3 className="text-sm font-serif font-semibold tracking-wide">
                  PANU AI
                </h3>
                <p className="text-[10px] text-regal-300 leading-tight mt-0.5">
                  AI-generated content. Please verify legally.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-regal-700 transition-colors"
              aria-label="Close chat"
            >
              <XIcon size={18} />
            </button>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Welcome message */}
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-70">
                <ScaleIcon size={36} className="text-regal-400 mb-3" />
                <p className="text-sm font-serif text-regal-700 font-semibold">
                  How may I assist you?
                </p>
                <p className="text-xs text-regal-500 mt-1.5 leading-relaxed max-w-[240px]">
                  Ask about petition drafting, legal procedures, or Indian law. I'm here to help.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-regal-800 text-regal-100 rounded-2xl rounded-br-md shadow-sm whitespace-pre-wrap'
                      : 'bg-white text-regal-900 rounded-2xl rounded-bl-md shadow-sm border border-regal-150 font-serif chatbot-markdown'
                  }`}
                  style={
                    msg.role === 'ai'
                      ? { borderColor: 'rgba(197,160,89,0.2)' }
                      : undefined
                  }
                >
                  {msg.role === 'ai' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="bg-white rounded-2xl rounded-bl-md shadow-sm border"
                  style={{ borderColor: 'rgba(197,160,89,0.2)' }}
                >
                  <BouncingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ─────────────────────────────────────────── */}
          <div className="flex-shrink-0 border-t border-regal-200 bg-white/80 px-3 py-2.5">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Type your legal query..."
                rows={1}
                className="flex-1 resize-none rounded-lg border border-regal-200 bg-regal-50/50 px-3 py-2 text-sm text-regal-900 placeholder-regal-400 focus:outline-none focus:ring-2 focus:ring-regal-500/30 focus:border-regal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans"
                style={{ maxHeight: '120px' }}
                aria-label="Type your message"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-regal-800 text-regal-100 hover:bg-regal-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                aria-label="Send message"
              >
                <SendIcon size={16} />
              </button>
            </div>
            <p className="text-[10px] text-regal-400 mt-1.5 text-center">
              Shift+Enter for new line &middot; ESC to close
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LegalChatbot;
