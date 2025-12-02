import React from 'react';
import { Blog } from '../types';
import { User } from 'lucide-react';

interface Props {
  blog: Blog;
}

const BlogCard: React.FC<Props> = ({ blog }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl p-4 border border-stone-100 hover:border-stone-200 transition-all shadow-sm hover:shadow-md">
      <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
        <img 
          src={blog.image_url} 
          alt={blog.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <span className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2 font-sans">
          {blog.category}
        </span>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3 leading-tight">{blog.title}</h3>
        <p className="text-stone-600 mb-4 line-clamp-2 leading-relaxed font-sans">
          {blog.content}
        </p>
        <div className="flex items-center gap-2 text-stone-400 text-sm mt-auto font-sans">
          <div className="bg-stone-100 p-1.5 rounded-full">
            <User size={14} />
          </div>
          <span className="font-medium text-stone-500">{blog.author}</span>
          <span className="w-1 h-1 bg-stone-300 rounded-full mx-1"></span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
