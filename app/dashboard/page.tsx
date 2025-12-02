import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigation } from '../../components/NavigationContext';
import { db } from '../../services/dataService';
import { ChefChatSession } from '../../types';
import { Shield, CreditCard, Clock, MessageSquare, ChevronRight, Bookmark, Settings } from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const [chatHistory, setChatHistory] = useState<ChefChatSession[]>([]);
  const [savedRecipesCount, setSavedRecipesCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('LOGIN');
      return;
    }
    const ids = db.getUserSavedRecipes(user.id);
    setSavedRecipesCount(ids.length);

    const loadHistory = async () => {
      const history = await db.getChefChatHistory(user.id);
      setChatHistory(history);
    };
    loadHistory();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-stone-900 text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-stone-900/20">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-1 title-float-effect">{user.name}</h1>
          <p className="text-stone-500 mb-4">{user.email}</p>
          <div className="flex justify-center md:justify-start gap-3">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
               user.subscriptionTier === 'premium' ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-600'
             }`}>
               {user.subscriptionTier === 'premium' ? 'Pro Member' : 'Guest Member'}
             </span>
             <span className="text-xs text-stone-400 flex items-center">
                Member since {new Date(user.memberSince || Date.now()).toLocaleDateString()}
             </span>
          </div>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
                <Settings size={16} /> Settings
            </button>
            <button 
                onClick={logout}
                className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-sm font-bold hover:bg-stone-200 transition-colors"
            >
                Log Out
            </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-stone-400" /> Subscription
                </h3>
                <div className="p-4 bg-stone-50 rounded-xl mb-4">
                    <p className="text-sm text-stone-500 mb-1">Current Plan</p>
                    <p className="text-lg font-bold text-stone-900 capitalize">{user.subscriptionTier}</p>
                    {user.subscriptionTier === 'premium' && (
                        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <CreditCard size={12} /> Next billing: {new Date(Date.now() + 2592000000).toLocaleDateString()}
                        </p>
                    )}
                </div>
                {user.subscriptionTier === 'free' ? (
                    <button 
                        onClick={() => navigate('SIGNUP')}
                        className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors"
                    >
                        Upgrade to Pro
                    </button>
                ) : (
                    <button className="w-full border border-stone-200 text-stone-600 py-2 rounded-lg font-bold text-sm hover:bg-stone-50 transition-colors">
                        Manage Billing
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Bookmark size={18} className="text-stone-400" /> Collection Stats
                </h3>
                <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <div>
                        <p className="text-3xl font-bold text-orange-600">{savedRecipesCount}</p>
                        <p className="text-xs font-bold text-orange-800/60 uppercase tracking-wide">Saved Recipes</p>
                    </div>
                    <div className="bg-orange-200/50 p-2 rounded-lg text-orange-600">
                        <Bookmark size={24} />
                    </div>
                </div>
            </div>
        </div>

        <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-full">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-stone-900 text-lg">Pro Chat History</h3>
                        <p className="text-stone-500 text-sm">Recent conversations with your Chef Concierge.</p>
                    </div>
                    <div className="bg-stone-100 text-stone-500 px-3 py-1 rounded-full text-xs font-bold">
                        {chatHistory.length} Sessions
                    </div>
                </div>

                <div className="divide-y divide-stone-100">
                    {chatHistory.length === 0 ? (
                        <div className="p-12 text-center text-stone-400">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No conversations yet.</p>
                            <p className="text-sm">Start asking questions on any recipe page!</p>
                        </div>
                    ) : (
                        chatHistory.map((session, i) => (
                            <div 
                                key={i} 
                                className="p-6 hover:bg-stone-50 transition-colors group cursor-pointer" 
                                onClick={() => navigate('RECIPE_DETAIL', { slug: session.recipeSlug || 'pumpkin-pancakes' })}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-stone-900">{session.recipeTitle}</span>
                                    </div>
                                    <span className="text-xs text-stone-400 flex items-center gap-1">
                                        <Clock size={12} /> {new Date(session.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-stone-600 text-sm line-clamp-2 mb-2 bg-stone-50 p-2 rounded-lg italic">
                                    "{session.lastMessage}"
                                </p>
                                <div className="flex justify-end">
                                    <span className="text-xs font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        View Recipe <ChevronRight size={12} />
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
