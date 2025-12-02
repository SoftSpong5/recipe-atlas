import React, { useEffect, useState } from 'react';
import { db } from '../../../services/dataService';
import { Recipe } from '../../../types';
import { Clock, Flame, MapPin, ChevronLeft, Share2, Printer, Smartphone, Check, Bookmark } from 'lucide-react';
import { useNavigation } from '../../../components/NavigationContext';
import { useToast } from '../../../components/ToastContext';
import { useShoppingList } from '../../../components/ShoppingListContext';
import { useAuth } from '../../../components/AuthContext';
import TTSButton from '../../../components/TTSButton';
import ChefChatWidget from '../../../components/ChefChatWidget';
import AdPlaceholder from '../../../components/AdPlaceholder';
import { useCollectionModal } from '../../../components/CollectionModalContext';

export default function RecipeDetailPage({ slug }: { slug: string }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [scale, setScale] = useState<number>(1);
  const [isMetric, setIsMetric] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);

  const { addItem } = useShoppingList();
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());

  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { openModal } = useCollectionModal();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const data = await db.getRecipeBySlug(slug);
      if (data) setRecipe(data);
      setLoading(false);
    };
    if (slug) fetchRecipe();
  }, [slug]);

  const formatIngredient = (ingredient: string) => {
    const match = ingredient.match(/^([\d\/\.\s]+)\s*(.*)/);
    if (!match) return ingredient;

    let amountStr = match[1].trim();
    let rest = match[2];
    let amount = 0;

    if (amountStr.includes('/')) {
        const parts = amountStr.split(' ');
        amount = parts.reduce((acc, part) => {
            if (part.includes('/')) {
                const [num, den] = part.split('/').map(Number);
                return acc + (den ? num / den : 0);
            }
            return acc + (parseFloat(part) || 0);
        }, 0);
    } else {
        amount = parseFloat(amountStr);
    }
    
    if (isNaN(amount)) return ingredient;

    let scaledAmount = amount * scale;

    if (isMetric) {
        const unitMatch = rest.match(/^([a-zA-Z]+)\s*(.*)/);
        if (unitMatch) {
            const unit = unitMatch[1].toLowerCase();
            const item = unitMatch[2];
            
            if (['cup', 'cups'].includes(unit)) return `${Math.round(scaledAmount * 237)} ml ${item}`;
            if (['tbsp', 'tablespoon', 'tablespoons'].includes(unit)) return `${Math.round(scaledAmount * 15)} ml ${item}`;
            if (['tsp', 'teaspoon', 'teaspoons'].includes(unit)) return `${Math.round(scaledAmount * 5)} ml ${item}`;
            if (['oz', 'ounce', 'ounces'].includes(unit)) return `${Math.round(scaledAmount * 28)} g ${item}`;
            if (['lb', 'lbs', 'pound', 'pounds'].includes(unit)) return `${Math.round(scaledAmount * 453)} g ${item}`;
        }
    }

    let formattedAmount = Number.isInteger(scaledAmount) 
      ? String(scaledAmount) 
      : scaledAmount.toFixed(2).replace('.00', '').replace('.50', ' ½').replace('.25', ' ¼').replace('.75', ' ¾');
    
    if (formattedAmount.startsWith('0 ')) {
      formattedAmount = formattedAmount.substring(2);
    }
      
    return `${formattedAmount} ${rest}`;
  };

  const toggleWakeLock = async () => {
    try {
      if (wakeLock) {
        await wakeLock.release();
        setWakeLock(null);
        showToast("Cook Mode Off", "info");
      } else if ('wakeLock' in navigator) {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
        showToast("Cook Mode On: Screen will stay awake", "success");
      } else {
        showToast("Wake Lock not supported on this device", "info");
      }
    } catch (err: any) {
      console.error(err.name, err.message);
      showToast("Failed to toggle Cook Mode", "info");
    }
  };

  const toggleIngredientSelection = (idx: number) => {
    const newSet = new Set(selectedIngredients);
    newSet.has(idx) ? newSet.delete(idx) : newSet.add(idx);
    setSelectedIngredients(newSet);
  };

  const addAllToShoppingList = () => {
    recipe!.ingredients.forEach((ingredient, idx) => {
        const text = formatIngredient(ingredient);
        addItem(text, recipe!.slug, recipe!.title);
    });
    setSelectedIngredients(new Set());
    showToast(`${recipe!.ingredients.length} items added to list!`, "success");
  };

  const handlePrint = () => window.print();

  const handleShare = async () => {
    if (navigator.share && recipe) {
        await navigator.share({ title: recipe.title, text: `Check out this recipe...`, url: window.location.href });
    } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
    }
  };

  const handleSave = () => {
    if (!user) {
        showToast("Please log in to save recipes.", "info");
        navigate('LOGIN');
        return;
    }
    openModal(recipe!.id);
  }

  if (loading) return <div className="h-96 bg-stone-100 rounded-3xl animate-pulse" />;
  if (!recipe) return <div className="text-center py-20 font-serif text-xl">Recipe not found.</div>;

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`text-xl ${i < Math.round(rating) ? 'text-orange-400' : 'text-stone-300'}`}>&#9733;</span>
  ));
  
  const ttsText = `
    Recipe: ${recipe.title}. 
    Ingredients: ${recipe.ingredients.join(', ')}.
    Steps: ${recipe.steps.map((s, i) => `Step ${i+1}. ${s}`).join(' ')}
  `;

  return (
    <div className="max-w-7xl mx-auto font-sans text-stone-900 bg-stone-50 print:bg-white print:p-0">
      
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button onClick={() => navigate('HOME')} className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-colors font-medium">
            <ChevronLeft size={20} /> Back to Atlas
        </button>
        <div className="flex gap-2">
            <TTSButton text={ttsText} />
            <button onClick={handlePrint} className="hidden md:flex items-center gap-2 px-3 py-2 bg-white text-stone-600 border border-stone-200 rounded-full text-sm font-bold hover:bg-stone-50">
                <Printer size={16} /> Print
            </button>
            <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 bg-white text-stone-600 border border-stone-200 rounded-full text-sm font-bold hover:bg-stone-50">
                <Share2 size={16} /> Share
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
              <header className="mb-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-2 w-max">
                      <MapPin size={12}/> {recipe.origin}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight text-stone-900 print:text-black title-float-effect">{recipe.title}</h1>
                <p className="text-lg text-stone-600 leading-relaxed">{recipe.description || `A delicious ${recipe.origin} inspired dish.`}</p>
              </header>

              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-8 bg-stone-100">
                  <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover"/>
              </div>

               <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-stone-700">Recipe Tools:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full">
                    <span className="text-xs font-bold text-stone-500 px-2">SCALE</span>
                    <button onClick={() => setScale(0.5)} className={`px-3 py-1 rounded-full text-sm font-bold ${scale === 0.5 ? 'bg-white shadow-sm' : 'text-stone-500'}`}>½x</button>
                    <button onClick={() => setScale(1)} className={`px-3 py-1 rounded-full text-sm font-bold ${scale === 1 ? 'bg-white shadow-sm' : 'text-stone-500'}`}>1x</button>
                    <button onClick={() => setScale(2)} className={`px-3 py-1 rounded-full text-sm font-bold ${scale === 2 ? 'bg-white shadow-sm' : 'text-stone-500'}`}>2x</button>
                  </div>
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full">
                      <button onClick={() => setIsMetric(false)} className={`px-3 py-1 rounded-full text-sm font-bold ${!isMetric ? 'bg-white shadow-sm' : 'text-stone-500'}`}>US</button>
                      <button onClick={() => setIsMetric(true)} className={`px-3 py-1 rounded-full text-sm font-bold ${isMetric ? 'bg-white shadow-sm' : 'text-stone-500'}`}>Metric</button>
                  </div>
                  <button onClick={toggleWakeLock} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${wakeLock ? 'bg-orange-600 text-white shadow-lg' : 'bg-white border'}`}>
                    <Smartphone size={16} /> {wakeLock ? 'Cook Mode Active' : 'Cook Mode'}
                  </button>
                </div>
              </div>

              <section className="mb-10 bg-white p-6 md:p-8 rounded-xl shadow-lg print:shadow-none print:p-0">
                  <h2 className="text-3xl font-serif font-bold mb-6 border-b pb-2 text-stone-800 print:text-black">Directions</h2>
                  <ol className="space-y-8">
                      {recipe.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-white mr-4 bg-stone-900 font-sans print:bg-black">
                                  {index + 1}
                              </div>
                              <p className="text-lg lg:text-xl text-stone-800 flex-grow font-sans leading-relaxed lg:leading-loose print:text-black">{step}</p>
                          </li>
                      ))}
                  </ol>
              </section>

              <div className="print:hidden"><AdPlaceholder format="banner" className="mb-10" /></div>
              
              <section className="mb-10 bg-white p-6 md:p-8 rounded-xl shadow-lg print:hidden">
                  <h2 className="text-3xl font-serif font-bold mb-6 border-b pb-2 text-stone-800">User Reviews</h2>
                  <div className="space-y-6">
                      {recipe.reviews_list?.length ? recipe.reviews_list.map((review, idx) => (
                          <div key={idx} className="p-4 bg-stone-50 rounded-lg border-l-4 border-orange-200">
                              <div className="flex items-center mb-2">{renderStars(review.rating)}</div>
                              <p className="text-stone-700 italic font-serif">"{review.text}"</p>
                          </div>
                      )) : <p className="text-stone-500 italic">No reviews yet.</p>}
                  </div>
              </section>
          </div>
          
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-20 self-start print:block">
               <div className="bg-white border border-stone-100 p-4 rounded-xl shadow-sm print:shadow-none print:border-none">
                  <div className="grid grid-cols-2 gap-3 text-sm print:grid-cols-4 print:gap-8">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                          <span className="font-bold text-stone-700">{recipe.prep_time}</span>
                          <span className="text-stone-500 text-xs">Prep Time</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                          <span className="font-bold text-stone-700">{recipe.total_time_minutes} min</span>
                          <span className="text-stone-500 text-xs">Total Time</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                          <span className="font-bold text-stone-700">{recipe.servings}</span>
                          <span className="text-stone-500 text-xs">Servings</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                          <span className="font-bold text-stone-700">{recipe.calories} kcal</span>
                          <span className="text-stone-500 text-xs">Calories</span>
                      </div>
                  </div>
              </div>
              <section className="bg-white p-6 rounded-xl shadow-lg print:shadow-none print:p-0">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-serif font-bold text-stone-800 print:text-black">Ingredients</h2>
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-full font-bold text-sm hover:bg-orange-100 hover:text-orange-800 transition-colors">
                        <Bookmark size={16} /> Save
                    </button>
                  </div>
                  <ul className="space-y-4">
                      {recipe.ingredients.map((ingredient, idx) => {
                          const formatted = formatIngredient(ingredient);
                          const isSelected = selectedIngredients.has(idx);
                          return (
                            <li key={idx} className="flex items-start gap-3 p-2 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer group" onClick={() => toggleIngredientSelection(idx)}>
                                <div className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-orange-600 border-orange-600' : 'border-stone-300'}`}>
                                    {isSelected && <Check size={14} className="text-white" />}
                                </div>
                                <span className={`text-lg lg:text-xl text-stone-800 flex-1 leading-relaxed lg:leading-loose ${isSelected ? 'line-through text-stone-400' : ''}`}>{formatted}</span>
                            </li>
                          );
                      })}
                  </ul>
                  
                  <button 
                      onClick={addAllToShoppingList} 
                      className="w-full mt-6 bg-stone-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors print:hidden"
                  >
                      Add All to List
                  </button>
                  
              </section>

              <section className="bg-white p-6 rounded-xl shadow-lg print:hidden">
                <h3 className="text-xl font-serif font-bold mb-4 text-stone-800">Recommended Gear</h3>
                <div className="space-y-4">
                  {recipe.affiliate_products.map((product, idx) => (
                    <a href={product.link} key={idx} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-stone-50 hover:bg-white border border-stone-100 hover:border-orange-200 rounded-xl transition-all group">
                      <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-stone-200 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-stone-800 group-hover:text-orange-800">{product.name}</p>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
              
              <div className="print:hidden"><AdPlaceholder format="vertical" /></div>
              
          </div>
      </div>
      {user && <ChefChatWidget recipe={recipe} />}
    </div>
  );
}
