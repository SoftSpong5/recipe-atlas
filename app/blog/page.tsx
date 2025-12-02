import React, { useEffect, useState } from 'react';
import { db } from '../../services/dataService';
import { Blog as BlogType } from '../../types';
import BlogCard from '../../components/BlogCard';
import AdPlaceholder from '../../components/AdPlaceholder';
import { useNavigation } from '../../components/NavigationContext';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await db.getBlogs();
      setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const categories = [
    { id: 'All', label: 'All Stories' },
    { id: 'Lifestyle', label: 'Lifestyle' },
    { id: 'Fashion', label: 'Kitchen Fashion' },
    { id: 'Food', label: 'Food & Drink' },
    { id: 'Wellness', label: 'Wellness' },
    { id: 'Gear', label: 'Pro Gear' }
  ];

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-serif font-bold text-stone-900 title-float-effect">Culinary Blog</h1>
        <p className="text-stone-500 font-sans text-lg">Insights on Gear, Lifestyle, and Wellness.</p>
      </div>

      <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        <div className="flex gap-2 min-w-max md:justify-center">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-medium text-sm transition-all border font-sans ${
                activeCategory === cat.id 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/50' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-600 hover:text-emerald-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="space-y-4 animate-pulse">
             <div className="h-48 bg-stone-200 rounded-2xl"></div>
             <div className="h-48 bg-stone-200 rounded-2xl"></div>
          </div>
        ) : (
          filteredBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))
        )}
      </div>

      <AdPlaceholder />
    </div>
  );
}
