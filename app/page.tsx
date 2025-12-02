import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../services/dataService';
import { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import TrendingRow from '../components/TrendingRow';
import AdPlaceholder from '../components/AdPlaceholder';
import { Search, Clock, Flame, ShoppingBag, ExternalLink, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { useNavigation } from '../components/NavigationContext';

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  // Filter state
  const [filters, setFilters] = useState({
    keyword: '',
    tags: [] as string[],
    maxPrepTime: 0,
    ingredients: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await db.getRecipes();
      setRecipes(data);
      setLoading(false);
    };
    fetchRecipes();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    recipes.forEach(r => r.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [recipes]);
  
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
        // Keyword filter
        if (filters.keyword && !recipe.title.toLowerCase().includes(filters.keyword.toLowerCase()) && !recipe.description?.toLowerCase().includes(filters.keyword.toLowerCase())) {
            return false;
        }
        // Tag filter
        if (filters.tags.length > 0 && !filters.tags.every(tag => recipe.tags.includes(tag))) {
            return false;
        }
        // Prep time filter
        if (filters.maxPrepTime > 0 && (recipe.prep_time_minutes || parseInt(recipe.prep_time) || 999) > filters.maxPrepTime) {
            return false;
        }
        // Ingredient filter
        if (filters.ingredients) {
            const requiredIngredients = filters.ingredients.toLowerCase().split(',').map(i => i.trim());
            const recipeIngredients = recipe.ingredients.join(' ').toLowerCase();
            if (!requiredIngredients.every(ing => recipeIngredients.includes(ing))) {
                return false;
            }
        }
        return true;
    });
  }, [recipes, filters]);

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
        ...prev,
        tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const handleAffiliateClick = async (productName: string, recipeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = await db.trackAffiliateClick(productName, recipeId);
    window.open(url, '_blank');
  };

  const heroRecipe = filteredRecipes[0];
  const trendingRecipes = filteredRecipes.slice(1, 4);
  const bottomRecipes = filteredRecipes.slice(4);

  return (
    <div className="space-y-16">
      {/* Search & Filter Section */}
      <section className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                <Search size={20} />
                </div>
                <input 
                type="text" 
                placeholder="Search by recipe name or description..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 bg-stone-50 transition-all text-stone-700 placeholder-stone-400 font-sans"
                value={filters.keyword}
                onChange={e => setFilters({...filters, keyword: e.target.value})}
                />
            </div>
            <button
                onClick={() => setShowFilters(!showFilters)} 
                className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm hover:bg-stone-200 transition-colors"
            >
                <SlidersHorizontal size={16}/>
                Filters
            </button>
        </div>

        {showFilters && (
            <div className="mt-6 pt-6 border-t border-stone-100 grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                <div>
                    <label className="text-sm font-bold text-stone-700 block mb-2">Filter by Tag</label>
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${filters.tags.includes(tag) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-500 border-stone-200 hover:border-emerald-400'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="prepTime" className="text-sm font-bold text-stone-700 block mb-2">Max Prep Time: <span className="text-orange-600">{filters.maxPrepTime || 'Any'} min</span></label>
                    <input 
                        id="prepTime"
                        type="range"
                        min="0"
                        max="120"
                        step="15"
                        value={filters.maxPrepTime}
                        onChange={e => setFilters({...filters, maxPrepTime: parseInt(e.target.value)})}
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-stone-700 block mb-2">Ingredients on Hand</label>
                    <input 
                        type="text"
                        placeholder="e.g. chicken, rice"
                        value={filters.ingredients}
                        onChange={e => setFilters({...filters, ingredients: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 bg-stone-50 transition-all text-sm"
                    />
                </div>
            </div>
        )}
      </section>

      {/* Recipe of the Day Hero */}
      <section>
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2 title-float-effect">
          <span className="w-1.5 h-8 bg-orange-600 rounded-full"></span>
          Recipe of the Day
        </h2>
        {loading ? (
          <div className="h-[500px] bg-stone-200 rounded-3xl animate-pulse"></div>
        ) : (
          heroRecipe && (
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden flex flex-col lg:flex-row">
               <div className="w-full lg:w-1/2 h-64 lg:h-auto relative cursor-pointer" onClick={() => navigate('RECIPE_DETAIL', { slug: heroRecipe.slug })}>
                 <img 
                   src={heroRecipe.image_url} 
                   alt={heroRecipe.title} 
                   className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                 />
                 <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-stone-900 shadow-sm font-sans">
                   Chef's Selection
                 </div>
               </div>
               <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase rounded-md tracking-wider font-sans">{heroRecipe.origin}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-500 text-sm font-medium font-sans">{heroRecipe.prep_time}</span>
                 </div>
                 
                 <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight cursor-pointer transition-colors title-float-effect" onClick={() => navigate('RECIPE_DETAIL', { slug: heroRecipe.slug })}>
                   {heroRecipe.title}
                 </h1>
                 
                 <div className="flex items-center gap-6 text-stone-500 mb-8 font-medium text-sm md:text-base font-sans">
                    <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-lg">
                       <Clock size={18} className="text-orange-600" /> {heroRecipe.prep_time}
                    </div>
                    <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-lg">
                       <Flame size={18} className="text-orange-600" /> {heroRecipe.calories} kcal
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 mb-10 font-sans">
                   <button 
                     onClick={() => navigate('RECIPE_DETAIL', { slug: heroRecipe.slug })}
                     className="flex-1 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95 text-center flex items-center justify-center gap-2"
                   >
                     View Full Recipe <ArrowRight size={18} />
                   </button>
                 </div>

                 {heroRecipe.affiliate_products && heroRecipe.affiliate_products.length > 0 && (
                   <div className="pt-8 border-t border-stone-100">
                     <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-sans">
                       <ShoppingBag size={14} /> Shop The Essentials
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {heroRecipe.affiliate_products.slice(0, 3).map((product, idx) => (
                         <a 
                           key={idx}
                           href={product.link}
                           target="_blank"
                           rel="noopener noreferrer"
                           onClick={(e) => handleAffiliateClick(product.name, heroRecipe.id, e)}
                           className="group cursor-pointer bg-stone-50 hover:bg-white border border-stone-100 hover:border-orange-200 rounded-xl p-3 transition-all duration-300 relative font-sans"
                         >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold text-stone-400 bg-white px-1.5 py-0.5 rounded border border-stone-100 group-hover:border-orange-100 group-hover:text-orange-600 transition-colors">
                                {product.price}
                              </span>
                              <ExternalLink size={12} className="text-stone-300 group-hover:text-orange-400" />
                            </div>
                            <p className="text-xs font-bold text-stone-800 line-clamp-2 leading-tight group-hover:text-orange-700">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                              {product.description}
                            </p>
                         </a>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
            </div>
          )
        )}
      </section>

      {/* Trending Recipes List */}
      <section>
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2 title-float-effect">
          <span className="w-1.5 h-8 bg-stone-900 rounded-full"></span>
          Trending Now
        </h2>
        <div className="flex flex-col gap-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-32 bg-stone-200 rounded-xl animate-pulse"></div>)
          ) : (
            trendingRecipes.map(recipe => (
              <TrendingRow key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </section>

      {/* AD PLACEMENT: Leaderboard */}
      <AdPlaceholder format="banner" />

      {/* Recent Collections */}
      <section>
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2 title-float-effect">
          <span className="w-1.5 h-8 bg-stone-200 rounded-full"></span>
          Recent Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {loading ? (
             [1, 2, 3, 4].map(i => <div key={i} className="h-72 bg-stone-200 rounded-2xl animate-pulse"></div>)
           ) : (
             <>
               {bottomRecipes.map((recipe, index) => (
                 <React.Fragment key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                    {index === 1 && (
                        <div className="hidden lg:block">
                             <AdPlaceholder format="rectangle" className="h-full" />
                        </div>
                    )}
                 </React.Fragment>
               ))}
             </>
           )}
        </div>
      </section>
    </div>
  );
}
