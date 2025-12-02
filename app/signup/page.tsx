import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigation } from '../../components/NavigationContext';
import { ChefHat, Sparkles, Calendar, ArrowRight, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import { validatePassword } from '../../utils/security';

export default function SignupPage() {
  const { signup } = useAuth();
  const { navigate } = useNavigation();
  
  const [step, setStep] = useState<'plan' | 'payment'>('plan');
  const [tier, setTier] = useState<'premium' | 'free'>('premium');
  const [processing, setProcessing] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [paymentData, setPaymentData] = useState({ number: '', expiry: '', cvc: '' });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePassword(formData.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setPasswordErrors([]);

    if (tier === 'free') {
      signup(formData.name, formData.email, formData.password, 'free');
    } else {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    await signup(formData.name, formData.email, formData.password, 'premium');
    setProcessing(false);
  };

  const formatCardNumber = (value: string) => value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (value: string) => value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim().slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 title-float-effect">
          {step === 'plan' ? 'Join the Chef\'s Table' : 'Secure Checkout'}
        </h1>
        <p className="text-lg text-stone-500">
          {step === 'plan' ? 'Choose the perfect plan for your culinary journey.' : 'Finalize your subscription to access premium features.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12 px-4 md:px-0 items-start">
        
        <div className="space-y-6">
          <div 
            onClick={() => step === 'plan' && setTier('premium')}
            className={`relative p-8 rounded-3xl border-2 transition-all overflow-hidden ${
              tier === 'premium' 
                ? 'border-orange-600 bg-orange-50/30 shadow-2xl' 
                : 'border-stone-100 bg-white hover:border-orange-200 cursor-pointer opacity-60 hover:opacity-100'
            }`}
          >
            {tier === 'premium' && <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">Selected</div>}
            <h3 className="text-2xl font-bold text-stone-900 font-serif flex items-center gap-2 mb-2">Pro Plan <ChefHat size={20} className="text-orange-600" /></h3>
            <div className="text-4xl font-bold text-orange-600 mb-2">$14.95<span className="text-lg text-stone-400 font-medium">/mo</span></div>
            <p className="text-sm text-stone-500 mb-8">Billed monthly. Cancel anytime.</p>
            <ul className="space-y-4">
              <li className="flex gap-3 text-stone-800 font-medium"><Calendar size={20} className="text-orange-500" /> Weekly Meal Planner</li>
              <li className="flex gap-3 text-stone-800 font-medium"><Sparkles size={20} className="text-orange-500" /> Personal Chef Chat</li>
              <li className="flex gap-3 text-stone-800 font-medium"><ChefHat size={20} className="text-orange-500" /> Exclusive Pro Content</li>
            </ul>
          </div>

          {step === 'plan' && (
            <div onClick={() => setTier('free')} className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer ${tier === 'free' ? 'border-stone-900 bg-white shadow-xl' : 'border-stone-100 bg-white hover:border-stone-300'}`}>
              <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-stone-900 font-serif">Guest</h3>
                    <p className="text-stone-500 text-sm">Essentials for casual cooking.</p>
                </div>
                <div className="text-xl font-bold text-stone-900">$0<span className="text-sm text-stone-400 font-medium">/mo</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm h-full">
          {step === 'plan' ? (
            <>
              <h3 className="text-xl font-bold text-stone-900 mb-6 text-center">Create your account</h3>
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all" placeholder="Gordon Ramsay" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all" placeholder="chef@example.com" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                      <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all" placeholder="••••••••" />
                      {passwordErrors.length > 0 && <p className="text-xs text-red-500 mt-1">Password must contain: {passwordErrors.join(', ')}.</p>}
                  </div>
                  <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2">
                      {tier === 'premium' ? 'Continue to Payment' : 'Complete Registration'}
                      {tier === 'premium' && <ArrowRight size={18} />}
                  </button>
              </form>
              <p className="mt-6 text-center text-sm text-stone-500">Already have an account? <span onClick={() => navigate('LOGIN')} className="text-stone-900 font-bold cursor-pointer hover:underline">Log in</span></p>
            </>
          ) : (
            <>
               <div className="flex items-center gap-2 mb-6 justify-center text-stone-400">
                  <Lock size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">256-Bit SSL Encrypted</span>
               </div>
               <h3 className="text-xl font-bold text-stone-900 mb-6 text-center">Payment Details</h3>
               <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Card Number</label>
                      <div className="relative"><CreditCard className="absolute left-4 top-3.5 text-stone-400" size={20} /><input type="text" required value={paymentData.number} onChange={e => setPaymentData({...paymentData, number: formatCardNumber(e.target.value)})} className="bg-stone-50 text-stone-900 w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-mono" placeholder="0000 0000 0000 0000" maxLength={19} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Expiry</label>
                        <input type="text" required value={paymentData.expiry} onChange={e => setPaymentData({...paymentData, expiry: formatExpiry(e.target.value)})} className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-mono" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">CVC</label>
                        <input type="text" required value={paymentData.cvc} onChange={e => setPaymentData({...paymentData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4)})} className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-mono" placeholder="123" maxLength={4} />
                    </div>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-xl flex justify-between items-center text-sm"><span className="text-stone-600">Total due today:</span><span className="font-bold text-stone-900 text-lg">$14.95</span></div>
                  <button type="submit" disabled={processing} className={`w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${processing ? 'opacity-80 cursor-wait' : ''}`}>
                      {processing ? 'Processing...' : <><ShieldCheck size={16} /> Pay & Subscribe</>}
                  </button>
               </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
