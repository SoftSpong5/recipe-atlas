import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../services/dataService';
import { ChatMessage } from '../../types';
import { moderateMessage } from '../../services/geminiService';
import { Send, AlertTriangle, ShieldCheck } from 'lucide-react';
import VoiceSearchInput from '../../components/VoiceSearchInput';
import { useAuth } from '../../components/AuthContext';

export default function CommunityPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadMessages = async () => {
      const data = await db.getChatLogs();
      setMessages(data);
    };
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    const moderation = await moderateMessage(input);
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'guest',
      username: user?.name || 'GuestChef',
      message: input,
      is_flagged: moderation.is_flagged,
      created_at: new Date().toISOString()
    };

    await db.addChatMessage(newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[75vh]">
      <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Chef's Table Community</h2>
          <p className="text-xs text-stone-500">Live discussions</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
          <ShieldCheck size={12} /> Moderated
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.user_id === (user?.id || 'guest') ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              msg.user_id === (user?.id || 'guest') 
                ? 'bg-stone-800 text-white rounded-br-none' 
                : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none'
            }`}>
              <div className={`text-xs font-bold mb-1 ${
                msg.user_id === (user?.id || 'guest') ? 'text-stone-400' : 'text-orange-600'
              }`}>
                {msg.username}
              </div>
              
              {msg.is_flagged ? (
                <div className="flex items-center gap-2 text-red-500 italic bg-red-50 p-2 rounded">
                  <AlertTriangle size={14} />
                  <span>[Message flagged for review]</span>
                </div>
              ) : (
                <p>{msg.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-stone-100">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <VoiceSearchInput onTranscript={setInput} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
          />
          <button 
            type="submit" 
            disabled={sending}
            className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
