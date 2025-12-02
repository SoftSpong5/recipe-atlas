import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useShoppingList } from '../../components/ShoppingListContext';
import { useToast } from '../../components/ToastContext';
import { db } from '../../services/dataService';
import { MealPlanEntry, Recipe } from '../../types';
import { Calendar, Plus, Trash2, ShoppingBag, Lock, ChefHat, ArrowRight } from 'lucide-react';
import { useNavigation } from '../../components/NavigationContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['breakfast', 'lunch', 'dinner'] as const;

export default function MealPlannerPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const { addItem } = useShoppingList();
  
  const [plan, setPlan] = useState<MealPlanEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState<{day: string, slot: string} | null>(null);

  useEffect(() => {
    if (user) {
      setPlan(db.getMealPlan(user.id));
    }
    db.getRecipes().then(setRecipes);
  }, [user]);

  const handleAssign = (recipe: Recipe) => {
    if (!isSelectorOpen || !user) return;
    
    const newEntry: MealPlanEntry = {
      day: isSelectorOpen.day,
      slot: isSelectorOpen.slot as any,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      recipeSlug: recipe.slug
    };

    // Remove existing for this slot
    const filtered = plan.filter(p => !(p.day === isSelectorOpen.day && p.slot === isSelectorOpen.slot));
    const newPlan = [...filtered, newEntry];
    
    setPlan(newPlan);
    db.saveMealPlan(user.id, newPlan);
    setIsSelectorOpen(null);
  };

  const handleRemove = (day: string, slot: string) => {
    if (!user) return;
    const newPlan = plan.filter(p => !(p.day === day && p.slot === slot));
    setPlan(newPlan);
    db.saveMealPlan(user.id, newPlan);
  };

  const generateShoppingList = () => {
    if (!plan.length) return;
    
    plan.forEach(entry => {
      const recipe = recipes.find(r => r.id === entry.recipeId);
      if (recipe) {
        recipe.ingredients.forEach(ing => {
          addItem(ing, recipe.slug, recipe.title);
        });
      }
    });
    showToast(`Added ingredients from ${plan.length} meals to your list.`, 'success');
    navigate('SHOPPING_LIST');
  };

  if (!user || user.subscriptionTier === 'free') {
    return (
        <div className="max-w-4xl mx-auto py-16 text-center">
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                <Lock size={32} />
            </div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4 title-float-effect">Weekly Meal Planner</h1>
            <p className="text-lg text-stone-500 mb-8 max-w-lg mx-auto">
                Plan your breakfasts, lunches, and dinners effortlessly. Automatically generate shopping lists based on your schedule.
            </p>
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm max-w-md mx-auto">
                <h3 className="font-bold text-xl mb-2">Pro Plan Exclusive</h3>
                <p className="text-stone-500 text-sm mb-6">Upgrade to the Pro Plan to unlock this tool.</p>
                <button 
                    onClick={() => navigate('SIGNUP')}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                >
                    Upgrade Now
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2 title-float-effect">Weekly Planner</h1>
            <p className="text-stone-500">Organize your culinary week.</p>
        </div>
        <button 
            onClick={generateShoppingList}
            className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg active:scale-95"
        >
            <ShoppingBag size={18} /> Generate Shopping List
        </button>
      </div>

      <div className="grid md:grid-cols-7 gap-4">
        {DAYS.map(day => (
            <div key={day} className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col h-full min-h-[400px]">
                <div className="bg-stone-50 p-3 text-center border-b border-stone-100 font-bold text-stone-900">
                    {day}
                </div>
                <div className="p-2 flex-1 flex flex-col gap-2">
                    {SLOTS.map(slot => {
                        const entry = plan.find(p => p.day === day && p.slot === slot);
                        return (
                            <div key={slot} className="flex-1 flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">{slot}</span>
                                {entry ? (
                                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 flex-1 relative group">
                                        <div className="text-xs font-bold text-stone-800 line-clamp-3 mb-4">{entry.recipeTitle}</div>
                                        <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => navigate('RECIPE_DETAIL', { slug: entry.recipeSlug })}
                                                className="p-1 bg-white text-stone-600 rounded hover:text-orange-600 shadow-sm"
                                            >
                                                <ArrowRight size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleRemove(day, slot)}
                                                className="p-1 bg-white text-red-500 rounded hover:bg-red-50 shadow-sm"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsSelectorOpen({ day, slot })}
                                        className="border-2 border-dashed border-stone-100 rounded-lg flex-1 flex items-center justify-center text-stone-300 hover:border-orange-300 hover:text-orange-400 transition-colors min-h-[80px]"
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>

      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95">
                <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Select Recipe for {isSelectorOpen.day} {isSelectorOpen.slot}</h3>
                    <button onClick={() => setIsSelectorOpen(null)} className="p-2 hover:bg-stone-100 rounded-full">
                        <Plus size={24} className="rotate-45 text-stone-500" />
                    </button>
                </div>
                <div className="overflow-y-auto p-4 space-y-2">
                    {recipes.map(recipe => (
                        <div 
                            key={recipe.id}
                            onClick={() => handleAssign(recipe)}
                            className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-orange-100"
                        >
                            <img src={recipe.image_url} className="w-12 h-12 rounded-lg object-cover bg-stone-200" alt="" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-stone-900">{recipe.title}</h4>
                                <p className="text-xs text-stone-500">{recipe.prep_time} • {recipe.calories} kcal</p>
                            </div>
                            <Plus size={16} className="text-orange-400" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
