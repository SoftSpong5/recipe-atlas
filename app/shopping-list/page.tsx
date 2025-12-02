import React from 'react';
import { useShoppingList } from '../../components/ShoppingListContext';
import { useNavigation } from '../../components/NavigationContext';
import { Trash2, CheckCircle, Circle, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function ShoppingListPage() {
  const { items, toggleItem, removeItem, clearList } = useShoppingList();
  const { navigate } = useNavigation();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('HOME')} 
          className="p-2 hover:bg-stone-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-stone-600" />
        </button>
        <h1 className="text-3xl font-serif font-bold text-stone-900 title-float-effect">Shopping List</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-stone-300" />
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Your list is empty</h2>
          <p className="text-stone-500 mb-6">Browse recipes and add ingredients to get started.</p>
          <button 
            onClick={() => navigate('HOME')}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
          >
            Explore Recipes
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <div className="text-sm font-bold text-stone-500 uppercase tracking-wider">
              {items.length} Items
            </div>
            <button 
              onClick={clearList}
              className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>
          
          <div className="divide-y divide-stone-100">
            {items.map(item => (
              <div key={item.id} className="p-4 hover:bg-stone-50 transition-colors flex items-center gap-4 group">
                <button 
                  onClick={() => toggleItem(item.id)}
                  className={`flex-shrink-0 transition-colors ${item.checked ? 'text-emerald-500' : 'text-stone-300 hover:text-orange-500'}`}
                >
                  {item.checked ? <CheckCircle size={24} className="fill-emerald-50" /> : <Circle size={24} />}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium transition-all ${item.checked ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                    {item.text}
                  </p>
                  {item.recipeTitle && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      From: <span 
                        className="hover:text-orange-600 cursor-pointer hover:underline"
                        onClick={() => item.recipeSlug && navigate('RECIPE_DETAIL', { slug: item.recipeSlug })}
                      >
                        {item.recipeTitle}
                      </span>
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-stone-300 hover:text-red-500 transition-all"
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
