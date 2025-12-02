import React, { useState, useRef, useEffect } from 'react';
import { askChefAI } from '../services/geminiService';
import { db } from '../services/dataService';
import { useAuth } from './AuthContext';
import { useNavigation } from './NavigationContext';
import { ChefHat, Send, Lock, X, Trash2 } from 'lucide-react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
}

const ChefChatWidget: React.FC<Props> = ({ recipe }) => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'user' | 'chef', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessage = { sender: 'chef' as const, text: `Hello! I'm your personal chef concierge. Ask me anything about the ${recipe.title}.` };
    if (isOpen && user) {
        const loadHistory = async () => {
            const history = await db.getChefChatHistory(user.id);
            const session = history.find(s => s.recipeId === recipe.id);
            if (session && session.messages.length > 0) {
                setMessages(session.messages);
            } else {
                setMessages([initialMessage]);
            }
        };
        loadHistory();
    } else {
        setMessages([]); // Clear messages when closed
    }
  }, [isOpen, user, recipe.id, recipe.title]);


  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Save session whenever messages update
  useEffect(() => {
      // Only save if there's more than the initial message
      if (user && messages.length > 1) {
          db.saveChefChatSession(user.id, {
              recipeId: recipe.id,
              recipeTitle: recipe.title,
              recipeSlug: recipe.slug,
              lastMessage: messages[messages.length - 1].text.slice(0, 100),
              timestamp: new Date().toISOString(),
              messages: messages
          });
      }
  }, [messages, user, recipe]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    // Context string for AI
    const context = `Recipe: ${recipe.title}. Ingredients: ${recipe.ingredients.join(', ')}. Method: ${recipe.steps.join(' ')}.`;

    try {
        const response = await askChefAI(context, userMsg);
        setMessages(prev => [...prev, { sender: 'chef', text: response }]);
    } catch (error) {
        setMessages(prev => [...prev, { sender: 'chef', text: "I'm having trouble connecting to the kitchen. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    if (!user) return;
    if (window.confirm("Are you sure you want to clear this conversation? This action cannot be undone.")) {
      db.clearChefChatSession(user.id, recipe.id);
      const initialMessage = { sender: 'chef' as const, text: `Hello! I'm your personal chef concierge. Ask me anything about the ${recipe.title}.` };
      setMessages([initialMessage]);
    }
  };

  if (!user) return null;

  const isPremium = user.subscriptionTier === 'premium';
  const canClear = isPremium && messages.length > 1;

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans print:hidden">
        {isOpen ? (
            <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden border border-stone-200 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <div className="bg-stone-900 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-600 p-1.5 rounded-lg">
                            <ChefHat size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Chef Concierge</h3>
                            <p className="text-[10px] text-stone-300">Context: {recipe.title.slice(0, 20)}...</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {canClear && (
                            <button onClick={handleClearConversation} title="Clear conversation" className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        )}
                        <button onClick={() => setIsOpen(false)} title="Close chat" className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {!isPremium ? (
                    <div className="p-8 text-center bg-stone-50 h-80 flex flex-col items-center justify-center">
                        <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-4">
                            <Lock size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 mb-2">Pro Plan Exclusive</h4>
                        <p className="text-sm text-stone-500 mb-6">Unlock personal chef guidance, context-aware substitutions, and wine pairings.</p>
                        <button 
                            onClick={() => { setIsOpen(false); navigate('SIGNUP'); }}
                            className="w-full bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                        >
                            Upgrade Now
                        </button>
                    </div>
                ) : (
                    <>
                        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 bg-stone-50 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                        msg.sender === 'user' 
                                            ? 'bg-orange-600 text-white rounded-br-none' 
                                            : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-100 flex gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about ingredients, steps..."
                                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600 transition-colors"
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading || !input.trim()}
                                className="bg-stone-900 text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        ) : (
            <button 
                onClick={() => setIsOpen(true)}
                className="group flex items-center gap-2 bg-stone-900 text-white pl-4 pr-5 py-3 rounded-full shadow-xl hover:bg-orange-600 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/10"
            >
                <div className="relative">
                    <ChefHat size={20} />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                    </span>
                </div>
                <span className="font-bold text-sm">Ask Chef</span>
            </button>
        )}
    </div>
  );
};

export default ChefChatWidget;
