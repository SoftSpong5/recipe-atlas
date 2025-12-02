import React, { useState, useEffect } from 'react';
import { useCollectionModal } from './CollectionModalContext';
import { useAuth } from './AuthContext';
import { db } from '../services/dataService';
import { RecipeCollection } from '../types';
import { Plus, X, Bookmark, Loader2, Check } from 'lucide-react';
import { useToast } from './ToastContext';

export default function AddToCollectionModal() {
  const { isOpen, recipeId, closeModal } = useCollectionModal();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [collections, setCollections] = useState<RecipeCollection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      db.getCollectionsForUser(user.id).then(userCollections => {
        setCollections(userCollections);
        // Pre-select collections that already contain this recipe
        const preSelected = new Set<string>();
        userCollections.forEach(c => {
            if (recipeId && c.recipeIds.includes(recipeId)) {
                preSelected.add(c.id);
            }
        });
        setSelectedCollections(preSelected);
        setLoading(false);
      });
    } else {
        // Reset state on close
        setCollections([]);
        setSelectedCollections(new Set());
        setIsCreating(false);
        setNewCollectionName('');
    }
  }, [isOpen, user, recipeId]);

  const handleToggleCollection = (collectionId: string) => {
    const newSet = new Set(selectedCollections);
    if (newSet.has(collectionId)) {
      newSet.delete(collectionId);
    } else {
      newSet.add(collectionId);
    }
    setSelectedCollections(newSet);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim() || !user) return;
    const newCollection = await db.createCollection(user.id, newCollectionName, '');
    setCollections(prev => [...prev, newCollection]);
    setSelectedCollections(prev => new Set(prev).add(newCollection.id));
    setNewCollectionName('');
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!user || !recipeId) return;
    
    for (const collection of collections) {
        const isIn = collection.recipeIds.includes(recipeId);
        const shouldBeIn = selectedCollections.has(collection.id);
        
        if (!isIn && shouldBeIn) {
            await db.addRecipeToCollection(user.id, collection.id, recipeId);
        }
    }
    showToast('Collections updated!', 'success');
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2"><Bookmark size={18}/> Add to Collection</h3>
          <button onClick={closeModal} className="p-2 hover:bg-stone-100 rounded-full">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        <div className="p-6 h-80 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-orange-600" size={32} />
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map(collection => (
                <div 
                  key={collection.id}
                  onClick={() => handleToggleCollection(collection.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedCollections.has(collection.id) 
                      ? 'border-orange-600 bg-orange-50/50' 
                      : 'border-stone-100 bg-stone-50 hover:border-orange-200'
                  }`}
                >
                  <span className="font-bold text-stone-800">{collection.name}</span>
                  {selectedCollections.has(collection.id) && <Check size={20} className="text-orange-600" />}
                </div>
              ))}
              
              {isCreating ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="New collection name..."
                    className="flex-1 bg-white border-2 border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600 transition-colors"
                  />
                  <button onClick={handleCreateCollection} className="px-3 bg-orange-600 text-white rounded-xl font-bold text-sm">Create</button>
                  <button onClick={() => setIsCreating(false)} className="px-3 bg-stone-200 text-stone-700 rounded-xl font-bold text-sm">Cancel</button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-bold text-sm"
                >
                  <Plus size={16} /> Create New Collection
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <button 
            onClick={handleSave}
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
