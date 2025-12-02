import React from 'react';
import { Recipe } from '../types';
import { Star, Clock, Flame, Bookmark } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { useAuth } from './AuthContext';
import { useCollectionModal } from './CollectionModalContext';
import { useToast } from './ToastContext';

interface Props {
  recipe: Recipe;
}

const TrendingRow: React.FC<Props> = ({ recipe }) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const { openModal } = useCollectionModal();
  const { showToast } = useToast();

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
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl p-4 gap-5 border border-stone-100 shadow-sm hover:shadow-md transition-all items-center group">
      <div 
        className="w-full sm:w-40 h-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden relative cursor-pointer"
        onClick={handleView}
      >
        <img 
          src={recipe.image_url} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-stone-800 sm:hidden font-sans">
            {recipe.origin}
        </div>
      </div>
      
      <div className="flex-1 w-full text-center sm:text-left">
        <div className="hidden sm:block text-xs font-bold text-orange-800 uppercase tracking-wider mb-1 font-sans">
            {recipe.origin}
        </div>
        <h3 
          onClick={handleView}
          className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-orange-800 transition-colors leading-tight cursor-pointer"
        >
            {recipe.title}
        </h3>
        
        <div className="flex items-center justify-center sm:justify-start gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < Math.floor(recipe.rating || 0) ? "fill-orange-400 text-orange-400" : "text-stone-200"} 
            />
          ))}
          <span className="text-xs text-stone-400 ml-1 font-sans">({recipe.reviews})</span>
        </div>

        <div className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-4 font-sans">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{recipe.prep_time}</span>
          </div>
          <div className="flex items-center gap-1">
             <Flame size={12} />
             <span>{recipe.calories} kcal</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:flex-col sm:gap-2">
        <button 
          onClick={handleView}
          className="flex-1 sm:w-32 bg-stone-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-orange-800 transition-colors shadow-sm whitespace-nowrap min-h-[44px] active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 font-sans"
        >
          View
        </button>
        <button 
          onClick={handleSaveClick}
          aria-label={"Add to collection"}
          className={`flex-1 sm:w-32 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 min-h-[44px] border flex items-center justify-center gap-2 active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-1 font-sans bg-white border-stone-200 text-stone-600 hover:text-orange-800 hover:border-orange-200 focus:ring-orange-500`}
        >
          Save
          <Bookmark size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default TrendingRow;
