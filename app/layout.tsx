import React from 'react';
import Header from '../components/Header';
import { useNavigation } from '../components/NavigationContext';

export default function RootLayout({ children }: { children?: React.ReactNode }) {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-sans">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-600 text-white px-4 py-2 rounded-md z-50 shadow-lg font-medium transition-all print:hidden"
      >
        Skip to content
      </a>
      <div className="print:hidden">
        <Header />
      </div>
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 scroll-mt-20 print:p-0 print:w-full print:max-w-none">
         {children}
      </main>
      <footer className="bg-white border-t border-stone-100 py-12 print:hidden">
        <div className="max-w-7xl mx-auto px-6 text-center text-stone-400 text-sm">
          <p className="mb-2">&copy; 2024 Recipe Atlas. Culinary Excellence.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('TERMS')} className="hover:text-stone-600">Terms of Service</button>
            <button onClick={() => navigate('PRIVACY')} className="hover:text-stone-600">Privacy Policy</button>
            <button onClick={() => navigate('DISCLAIMER')} className="hover:text-stone-600">Disclaimer</button>
            <button onClick={() => navigate('PARTNER')} className="hover:text-stone-600">Contact / Partner</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
