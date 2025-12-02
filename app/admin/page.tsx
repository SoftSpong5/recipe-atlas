import React from 'react';
import AdminPanel from '../../components/AdminPanel';
import { useAuth } from '../../components/AuthContext';
import { Lock } from 'lucide-react';
import { useNavigation } from '../../components/NavigationContext';

export default function AdminPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  // Simple admin check based on a mock user detail
  if (!user || user.email !== 'admin@recipeatlas.com') {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
          <Lock size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">Access Denied</h1>
        <p className="text-lg text-stone-500 mb-8">
          You do not have the required permissions to view this page.
        </p>
        <button 
            onClick={() => navigate('HOME')}
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
        >
            Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8 title-float-effect">Admin Dashboard</h1>
      <AdminPanel />
    </div>
  );
}
