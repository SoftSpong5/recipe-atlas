import React, { useEffect, useState } from 'react';
import { db } from '../../../services/dataService';
import { Recipe, RecipeCollection } from '../../../types';
import { useNavigation } from '../../../components/NavigationContext';
import { ArrowLeft, User } from 'lucide-react';
import RecipeCard from '../../../components/RecipeCard';

export default function CollectionDetailPage({ slug }: { slug: string }) {
  const [collection, setCollection] = useState<RecipeCollection | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  useEffect(() => {
    const fetchCollection = async () => {
      if (!slug) return;
      setLoading(true);
      const collectionData = await db.getCollectionBySlug(slug);
      setCollection(collectionData);
      
      if (collectionData) {
        const allRecipes = await db.getRecipes();
        const collectionRecipes = allRecipes.filter(r => collectionData.recipeIds.includes(r.id));
        setRecipes(collectionRecipes);
      }
      setLoading(false);
    };
    fetchCollection();
  }, [slug]);

  if (loading) return <div className="h-96 bg-stone-100 rounded-3xl animate-pulse" />;
  if (!collection) return <div className="text-center py-20 font-serif text-xl">Collection not found.</div>;

  return (
    <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('HOME')}
          className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <header className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 title-float-effect">{collection.name}</h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto mb-4">{collection.description}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-stone-400">
                <User size={14}/>
                <span className="font-medium">Curated by {collection.authorName}</span>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
    </div>
  );
}
