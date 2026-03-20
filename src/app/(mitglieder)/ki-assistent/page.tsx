'use client';
import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Willkommen beim Arkanum KI-Assistenten! ✦ Ich bin speziell auf die Inhalte der Arkanum Akademie trainiert. Ich kann dir helfen, Kursthemen zu vertiefen, Fragen zu beantworten und deinen Lernweg zu optimieren. Was möchtest du wissen?',
    timestamp: new Date().toISOString(),
  },
];

export default function KiAssistentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Erkläre mir das Prinzip der Synchronizität',
    'Was sind die sieben hermetischen Prinzipien?',
    'Wie beginne ich mit luziden Träumen?',
    'Was ist der Unterschied zwischen Chakren und Aura?',
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ki/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json() as { content?: string; error?: string };

      if (!res.ok || !data.content) {
        setError(data.error ?? 'Unbekannter Fehler. Bitte versuche es erneut.');
      } else {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch {
      setError('Verbindungsfehler. Bitte überprüfe deine Internetverbindung und versuche es erneut.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">KI-Assistent ✦</h1>
        <p className="text-[var(--text-secondary)] text-sm">Dein persönlicher Lernbegleiter auf dem spirituellen Pfad.</p>
      </div>

      <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl flex flex-col overflow-hidden shadow-[var(--shadow-sm)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-violet-600 text-white' : 'bg-amber-500 text-white'
              }`}>
                {msg.role === 'assistant' ? '✦' : 'M'}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] rounded-tl-none border border-[var(--border-base)]'
                  : 'bg-violet-600 text-white rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm text-white flex-shrink-0">✦</div>
              <div className="bg-[var(--bg-surface-raised)] border border-[var(--border-base)] px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          {error && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full status-error flex items-center justify-center text-sm flex-shrink-0">!</div>
              <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm status-error rounded-tl-none">
                {error}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-6 py-3 border-t border-[var(--border-base)]">
            <p className="text-xs text-[var(--text-muted)] mb-2">Vorschläge:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs brand-chip px-3 py-1.5 rounded-full hover:bg-[var(--badge-brand-bg)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[var(--border-base)] flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Stelle deine Frage..."
            className="flex-1 bg-[var(--input-bg)] border border-[var(--border-base)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl transition-all font-medium text-sm"
          >
            Senden
          </button>
        </div>
      </div>
    </div>
  );
}
