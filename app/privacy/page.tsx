import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../components/NavigationContext';

export default function PrivacyPage() {
    const { navigate } = useNavigation();
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-stone-200 shadow-sm">
            <button 
              onClick={() => navigate('HOME')}
              className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>
            <div className="prose prose-stone max-w-none prose-h1:font-serif prose-h2:font-serif">
                <h1 className="title-float-effect">Privacy Policy</h1>
                <p className="text-sm text-stone-500">Last Updated: {new Date().toLocaleDateString()}</p>
                <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service.</p>
                
                <h2>1. Information We Collect</h2>
                <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                <ul>
                    <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, First name and last name, and Payment information.</li>
                    <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address, browser type, and browser version.</li>
                </ul>

                <h2>2. Use of Your Personal Data</h2>
                <p>Recipe Atlas may use Personal Data for the following purposes:</p>
                <ul>
                    <li>To provide and maintain our Service.</li>
                    <li>To manage Your Account and subscription.</li>
                    <li>To process your payments securely.</li>
                    <li>To contact You with updates or promotional materials.</li>
                </ul>

                <h2>3. Security of Your Data</h2>
                <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. We use commercially acceptable means to protect your Personal Data, but we cannot guarantee its absolute security.</p>
            </div>
        </div>
    );
}
