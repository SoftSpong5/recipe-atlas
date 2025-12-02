import React from 'react';
import { NavigationProvider, useNavigation } from './components/NavigationContext';
import { ToastProvider } from './components/ToastContext';
import { ShoppingListProvider } from './components/ShoppingListContext';
import { AuthProvider } from './components/AuthContext';
import { CollectionModalProvider } from './components/CollectionModalContext';

import RootLayout from './app/layout';
import HomePage from './app/page';
import BlogPage from './app/blog/page';
import CommunityPage from './app/community/page';
import AdminPage from './app/admin/page';
import RecipeDetailPage from './app/recipes/[slug]/page';
import ShoppingListPage from './app/shopping-list/page';
import LoginPage from './app/login/page';
import SignupPage from './app/signup/page';
import PartnerPage from './app/partner/page';
import MealPlannerPage from './app/planner/page';
import UserDashboard from './app/dashboard/page';
import CollectionDetailPage from './app/collections/[slug]/page';
import TermsPage from './app/terms/page';
import PrivacyPage from './app/privacy/page';
import DisclaimerPage from './app/disclaimer/page';
import AddToCollectionModal from './components/AddToCollectionModal';


const PageRenderer = () => {
  const { currentPath } = useNavigation();

  switch (currentPath.currentPage) {
    case 'HOME': return <HomePage />;
    case 'BLOG': return <BlogPage />;
    case 'COMMUNITY': return <CommunityPage />;
    case 'ADMIN': return <AdminPage />;
    case 'RECIPE_DETAIL': return <RecipeDetailPage slug={currentPath.params?.slug || ''} />;
    case 'SHOPPING_LIST': return <ShoppingListPage />;
    case 'LOGIN': return <LoginPage />;
    case 'SIGNUP': return <SignupPage />;
    case 'PARTNER': return <PartnerPage />;
    case 'MEAL_PLANNER': return <MealPlannerPage />;
    case 'USER_DASHBOARD': return <UserDashboard />;
    case 'COLLECTION_DETAIL': return <CollectionDetailPage slug={currentPath.params?.slug || ''} />;
    case 'TERMS': return <TermsPage />;
    case 'PRIVACY': return <PrivacyPage />;
    case 'DISCLAIMER': return <DisclaimerPage />;
    default: return <HomePage />;
  }
};

const App = () => {
  return (
    <NavigationProvider>
      <ToastProvider>
        <ShoppingListProvider>
          <AuthProvider>
            <CollectionModalProvider>
                <RootLayout>
                  <PageRenderer />
                </RootLayout>
                <AddToCollectionModal />
            </CollectionModalProvider>
          </AuthProvider>
        </ShoppingListProvider>
      </ToastProvider>
    </NavigationProvider>
  );
};

export default App;
