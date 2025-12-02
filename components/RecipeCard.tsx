import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { Clock, Flame, MapPin, ArrowRight, Bookmark } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { useAuth } from './AuthContext';
import { useCollectionModal } from './CollectionModalContext';
import { useToast } from './ToastContext';

interface Props {
  recipe: Recipe;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const { openModal } = useCollectionModal();
  const { showToast } = useToast();
  
  const isNew = new Date(recipe.created_at) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast("Please log in to create collections.", "info");
      navigate('LOGIN');
      return;
    }
    openModal(recipe.id);
  };

  const handleView = () => {
    navigate('RECIPE_DETAIL', { slug: recipe.slug });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={handleView}>
        <img 
          src={recipe.image_url} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-stone-800 flex items-center gap-1 shadow-sm font-sans">
          <MapPin size={12} /> {recipe.origin}
        </div>
        {isNew && (
            <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm font-sans animate-in fade-in zoom-in-50">
              New!
            </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-md font-sans">
              {tag}
            </span>
          ))}
        </div>
        <h3 
          onClick={handleView}
          className="text-xl font-serif font-bold text-stone-900 mb-2 leading-tight group-hover:text-orange-800 transition-colors cursor-pointer"
        >
          {recipe.title}
        </h3>
        <div className="flex items-center gap-4 text-stone-500 text-sm mt-2 mb-6 font-sans">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{recipe.prep_time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={14} />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-stone-100 flex flex-col md:flex-row gap-3">
           <button 
             onClick={handleView}
             className="flex-1 bg-stone-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-orange-800 transition-all duration-300 text-sm min-h-[44px] flex items-center justify-center gap-2 active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 font-sans"
           >
             View <ArrowRight size={16} aria-hidden="true" />
           </button>
           <button 
             onClick={handleSaveClick}
             aria-label={"Add to collection"}
             className={`flex-1 md:flex-none md:w-auto px-6 font-medium py-3 rounded-xl transition-all duration-200 text-sm min-h-[44px] flex items-center justify-center gap-2 border active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-1 font-sans bg-stone-50 text-stone-600 border-stone-200 hover:bg-white hover:text-orange-800 hover:border-orange-200 focus:ring-orange-500`}
           >
             Save <Bookmark size={16} aria-hidden="true" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
