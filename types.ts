export interface AffiliateProduct {
  name: string;
  link: string;
  price: string;
  description?: string;
  clicks?: number;
  image_url?: string;
}

export interface Nutrition {
  fat: number;
  carbs: number;
  protein: number;
}

export interface Review {
  rating: number;
  text: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  origin: string;
  ingredients: string[];
  steps: string[];
  prep_time: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  servings?: number;
  calories: number;
  nutrition?: Nutrition;
  tags: string[];
  image_url: string;
  imagePrompt?: string; 
  affiliate_products: AffiliateProduct[];
  rating?: number;
  reviews?: number;
  reviews_list?: Review[];
  description?: string;
  created_at: string;
}

export interface RecipeCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  authorName: string;
  recipeIds: string[];
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: 'Lifestyle' | 'Gear' | 'Wellness' | 'Fashion' | 'Food';
  content: string;
  image_url: string;
  author: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  is_flagged: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  type: 'Sponsorship' | 'Affiliate' | 'General';
  subject: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  recipeSlug?: string;
  recipeTitle?: string;
}

export interface MealPlanEntry {
  day: string; 
  slot: 'breakfast' | 'lunch' | 'dinner';
  recipeId?: string;
  recipeTitle?: string;
  recipeSlug?: string;
}

export interface ChefChatSession {
  recipeId: string;
  recipeTitle: string;
  recipeSlug?: string;
  lastMessage: string;
  timestamp: string;
  messages: {sender: 'user' | 'chef', text: string}[];
}

export type SubscriptionTier = 'free' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  avatarUrl?: string;
  memberSince?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, tier: SubscriptionTier) => Promise<void>;
  logout: () => void;
}

export type PageView = 'HOME' | 'BLOG' | 'COMMUNITY' | 'ADMIN' | 'RECIPE_DETAIL' | 'SHOPPING_LIST' | 'LOGIN' | 'SIGNUP' | 'PARTNER' | 'MEAL_PLANNER' | 'USER_DASHBOARD' | 'COLLECTION_DETAIL' | 'TERMS' | 'PRIVACY' | 'DISCLAIMER';

export interface NavigationState {
  currentPage: PageView;
  params?: { slug?: string };
}
