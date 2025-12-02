import React, { useState } from 'react';
import { useToast } from '../../components/ToastContext';
import { db } from '../../services/dataService';
import { Handshake, Send, Building2, Megaphone, ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../components/NavigationContext';

export default function PartnerPage() {
  const { showToast } = useToast();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'General',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await db.sendContactMessage({
        name: formData.name,
        email: formData.email,
        type: formData.type as any,
        subject: formData.subject,
        message: formData.message
      });
      showToast("Message sent! We'll be in touch shortly.", 'success');
      setFormData({ name: '', email: '', type: 'General', subject: '', message: '' });
    } catch (error) {
      showToast("Failed to send message. Please try again.", 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <button 
          onClick={() => navigate('HOME')}
          className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 title-float-effect">Partner with Recipe Atlas</h1>
        <p className="text-xl text-stone-500 max-w-2xl leading-relaxed">
          Reach a dedicated audience of culinary enthusiasts. We offer bespoke sponsorship packages, affiliate integrations, and brand storytelling opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <Handshake size={24} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Sponsorships</h3>
          <p className="text-stone-500 text-sm">Feature your cookware, appliances, or ingredients in our uniquely crafted recipes.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Building2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Affiliate Programs</h3>
          <p className="text-stone-500 text-sm">Integrate your product catalog into our "Shop the Essentials" modules.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Megaphone size={24} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Brand Stories</h3>
          <p className="text-stone-500 text-sm">Collaborate on editorial blog content that highlights your brand's heritage.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        <div className="bg-stone-900 p-8 text-white">
          <h2 className="text-2xl font-serif font-bold">Contact Our Partnerships Team</h2>
          <p className="text-stone-400 mt-2">Fill out the form below and we will get back to you within 24 hours.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Company / Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                placeholder="Le Creuset"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Business Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                placeholder="partners@brand.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Inquiry Type</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
            >
              <option value="General">General Inquiry</option>
              <option value="Sponsorship">Sponsorship Opportunity</option>
              <option value="Affiliate">Affiliate Program Integration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Subject</label>
            <input 
              type="text" 
              required
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
              placeholder="Q4 Partnership Proposal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Message</label>
            <textarea 
              required
              rows={5}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all resize-none"
              placeholder="Tell us about your brand and what kind of partnership you are looking for..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : <><Send size={18} /> Send Inquiry</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
