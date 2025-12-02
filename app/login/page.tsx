import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigation } from '../../components/NavigationContext';
import { ChefHat } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <div className="text-center mb-8">
        <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-orange-600/20">
            <ChefHat size={32} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900 title-float-effect">Welcome Back</h1>
        <p className="text-stone-500">Sign in to access your kitchen.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                    placeholder="chef@example.com"
                />
            </div>
            <div>
                <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-stone-700">Password</label>
                    <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline">Forgot?</span>
                </div>
                <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="bg-stone-50 text-stone-900 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                    placeholder="••••••••"
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg active:scale-95"
            >
                Sign In
            </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500">
            Don't have an account? <span onClick={() => navigate('SIGNUP')} className="text-stone-900 font-bold cursor-pointer hover:underline">Join free</span>
        </p>
      </div>
    </div>
  );
}
