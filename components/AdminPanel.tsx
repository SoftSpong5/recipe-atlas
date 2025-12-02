import React, { useState, useEffect } from 'react';
import { generateDailyRecipe, generateDailyBlog, createImagePromptFromRecipe } from '../services/geminiService';
import { db } from '../services/dataService';
import { Recipe, Blog, ContactMessage } from '../types';
import { Zap, CheckCircle, Database, BarChart3, TrendingUp, DollarSign, XCircle, Check, Mail, Clock } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'control' | 'analytics' | 'approvals' | 'inbox'>('control');
  const [inboxMessages, setInboxMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    if (activeTab === 'inbox') {
      const loadMessages = async () => {
        const msgs = await db.getAdminMessages();
        setInboxMessages(msgs);
      };
      loadMessages();
    }
  }, [activeTab]);

  const log = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const triggerDailyCron = async () => {
    setProcessing(true);
    log("Starting Daily Cron Job (Parallel Execution)...");

    try {
      const [recipeData, blogData] = await Promise.all([
        generateDailyRecipe().then(res => {
            log("Generated Recipe Data.");
            return res;
        }),
        generateDailyBlog().then(res => {
            log("Generated Blog Data.");
            return res;
        })
      ]);
      
      log("Creating image prompt for recipe...");
      const imagePrompt = await createImagePromptFromRecipe(recipeData.title || "Untitled", recipeData.origin || "Unknown");
      log(`Image prompt: "${imagePrompt}"`);
      
      const newRecipe: Recipe = {
        id: crypto.randomUUID(),
        title: recipeData.title || "Untitled",
        slug: (recipeData.title || "untitled").toLowerCase().replace(/ /g, '-'),
        origin: recipeData.origin || "Unknown",
        ingredients: recipeData.ingredients || [],
        steps: recipeData.steps || [],
        prep_time: recipeData.prep_time || "30m",
        calories: recipeData.calories || 0,
        tags: recipeData.tags || [],
        image_url: `https://placehold.co/1000x600/a38b79/ffffff?text=${encodeURIComponent(recipeData.title || "New Recipe")}`,
        imagePrompt: imagePrompt,
        affiliate_products: recipeData.affiliate_products || [],
        rating: 0,
        reviews: 0,
        created_at: new Date().toISOString()
      };
      
      const newBlog: Blog = {
        id: crypto.randomUUID(),
        title: blogData.title || "Untitled",
        slug: (blogData.title || "untitled").toLowerCase().replace(/ /g, '-'),
        category: (blogData.category as any) || "Lifestyle",
        content: blogData.content || "",
        image_url: `https://placehold.co/1000x600/5a677a/ffffff?text=${encodeURIComponent(blogData.title || "New Blog")}`,
        author: blogData.author || "Culinary Editor",
        created_at: new Date().toISOString()
      };

      await Promise.all([
        db.addRecipe(newRecipe),
        db.addBlog(newBlog)
      ]);

      log(`SUCCESS: Inserted Recipe "${newRecipe.title}" & Blog "${newBlog.title}"`);

    } catch (error: any) {
      log(`ERROR: ${error.message}`);
    } finally {
      setProcessing(false);
      log("Cron Job Finished.");
    }
  };

  const MockAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <BarChart3 size={20} />
          </div>
          <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total Views</span>
        </div>
        <p className="text-3xl font-bold text-stone-900">124,592</p>
        <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1"><TrendingUp size={12} /> +12% this week</span>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
            <DollarSign size={20} />
          </div>
          <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total Revenue</span>
        </div>
        <p className="text-3xl font-bold text-stone-900">$4,820.50</p>
        <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1"><TrendingUp size={12} /> +8% this week</span>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
            <Database size={20} />
          </div>
          <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Content Items</span>
        </div>
        <p className="text-3xl font-bold text-stone-900">8 Recipes, 4 Blogs</p>
        <span className="text-xs text-stone-400 flex items-center gap-1 mt-1">Live in database</span>
      </div>
    </div>
  );

  const AffiliateApprovals = () => (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
        <div className="p-4 border-b border-stone-100">
            <h3 className="font-bold text-stone-900">Affiliate Product Review Queue</h3>
            <p className="text-sm text-stone-500">Approve or deny new product suggestions.</p>
        </div>
        <div className="divide-y divide-stone-100">
            <div className="p-4 flex justify-between items-center">
                <div>
                    <p className="font-bold text-stone-800">Vitamix Explorian Blender</p>
                    <p className="text-xs text-stone-500">Suggested for: "Tropical Mango Chicken"</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={18} /></button>
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle size={18} /></button>
                </div>
            </div>
            <div className="p-4 flex justify-between items-center">
                <div>
                    <p className="font-bold text-stone-800">Japanese Mandoline Slicer</p>
                    <p className="text-xs text-stone-500">Suggested for: "Vibrant Quinoa Power Salad"</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={18} /></button>
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle size={18} /></button>
                </div>
            </div>
        </div>
    </div>
  );
  
  const AdminInbox = () => (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
        <div className="p-4 border-b border-stone-100">
            <h3 className="font-bold text-stone-900">Partnership Inquiries</h3>
            <p className="text-sm text-stone-500">Messages from sponsors & affiliates.</p>
        </div>
        <div className="divide-y divide-stone-100">
            {inboxMessages.length > 0 ? inboxMessages.map(msg => (
                <div key={msg.id} className="p-4 hover:bg-stone-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${msg.type === 'Sponsorship' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>{msg.type}</span>
                            <p className="font-bold text-stone-800 mt-2">{msg.name} <span className="text-sm text-stone-400 font-normal">({msg.email})</span></p>
                            <p className="text-sm font-medium text-stone-600">{msg.subject}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                           {msg.status === 'unread' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                           <Clock size={12} /> {new Date(msg.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    <p className="text-sm text-stone-500 mt-2 bg-stone-50 p-3 rounded-lg">{msg.message}</p>
                </div>
            )) : <p className="p-4 text-sm text-stone-500">No messages.</p>}
        </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
      <div className="flex border-b border-stone-200 mb-6">
          <button onClick={() => setActiveTab('control')} className={`px-4 py-3 font-bold text-sm ${activeTab === 'control' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-stone-500'}`}>Control Panel</button>
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-3 font-bold text-sm ${activeTab === 'analytics' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-stone-500'}`}>Analytics</button>
          <button onClick={() => setActiveTab('approvals')} className={`px-4 py-3 font-bold text-sm ${activeTab === 'approvals' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-stone-500'}`}>Approvals</button>
          <button onClick={() => setActiveTab('inbox')} className={`px-4 py-3 font-bold text-sm ${activeTab === 'inbox' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-stone-500'}`}>Inbox</button>
      </div>

      {activeTab === 'control' && (
        <>
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 mb-6 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-stone-900">Automated Content Generation</h2>
              <p className="text-sm text-stone-500">Trigger the daily cron job to generate a new recipe and blog post.</p>
            </div>
            <button
              onClick={triggerDailyCron}
              disabled={processing}
              className="bg-stone-900 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50"
            >
              <Zap size={16} /> {processing ? 'Generating...' : 'Run Cron Job'}
            </button>
          </div>
          <div className="bg-stone-800 text-stone-300 font-mono text-xs rounded-xl p-4 h-64 overflow-y-auto">
            {logs.map((l, i) => <p key={i} className={l.startsWith('ERROR') ? 'text-red-400' : l.startsWith('SUCCESS') ? 'text-emerald-400' : ''}>{l}</p>)}
          </div>
        </>
      )}

      {activeTab === 'analytics' && <MockAnalytics />}
      {activeTab === 'approvals' && <AffiliateApprovals />}
      {activeTab === 'inbox' && <AdminInbox />}

    </div>
  );
};

export default AdminPanel;
