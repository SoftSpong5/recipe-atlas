import React, { useState } from 'react';
import { useNavigation } from './NavigationContext';
import { useAuth } from './AuthContext';
import { LayoutGrid, BookOpen, Users, Shield, ChefHat, ShoppingBag, LogIn, LogOut, User as UserIcon, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'HOME', label: 'Atlas', icon: LayoutGrid },
    { id: 'BLOG', label: 'Blog', icon: BookOpen },
    { id: 'MEAL_PLANNER', label: 'Planner', icon: Calendar },
    { id: 'SHOPPING_LIST', label: 'List', icon: ShoppingBag },
    { id: 'COMMUNITY', label: 'Community', icon: Users },
    { id: 'ADMIN', label: 'Admin', icon: Shield },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 text-stone-900 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate('HOME')}
        >
          <div className="relative">
             <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-xl shadow-lg shadow-orange-500/20">
              <ChefHat size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-tight title-float-effect">Recipe Atlas</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex gap-1">
            {navItems.map(item => (
                <button
                key={item.id}
                onClick={() => navigate(item.id as any)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    currentPath.currentPage === item.id
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
                >
                <item.icon size={16} />
                <span>{item.label}</span>
                </button>
            ))}
            </nav>

            {/* Auth / Profile Section */}
            <div className="border-l border-stone-200 pl-4 ml-2">
                {user ? (
                    <div className="relative">
                        <button 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 hover:bg-stone-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-stone-100"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${user.subscriptionTier === 'premium' ? 'bg-orange-600' : 'bg-stone-400'}`}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-stone-700 hidden sm:block">{user.name}</span>
                        </button>
                        
                        {showProfileMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-stone-50">
                                        <p className="text-sm font-bold text-stone-900">{user.name}</p>
                                        <p className="text-xs text-stone-500 capitalize">{user.subscriptionTier} Member</p>
                                    </div>
                                    <button 
                                        onClick={() => { setShowProfileMenu(false); navigate('USER_DASHBOARD'); }}
                                        className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2"
                                    >
                                        <UserIcon size={14} /> Profile & Stats
                                    </button>
                                    <button 
                                        onClick={() => { setShowProfileMenu(false); navigate('SHOPPING_LIST'); }}
                                        className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2"
                                    >
                                        <ShoppingBag size={14} /> Shopping List
                                    </button>
                                    <button 
                                        onClick={() => { setShowProfileMenu(false); logout(); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate('LOGIN')}
                            className="text-stone-600 hover:text-stone-900 font-medium text-sm px-3 py-2 transition-colors hidden sm:block"
                        >
                            Log in
                        </button>
                        <button 
                            onClick={() => navigate('SIGNUP')}
                            className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm"
                        >
                            Join
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
