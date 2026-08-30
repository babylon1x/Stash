import React from 'react';
import { Pencil, Trash2, Plus, Bookmark } from 'lucide-react';
import type { Category, Post } from '../../types';
import { PostEmbed } from '../post/PostEmbed';

interface CategoryRowProps {
  category: Category;
  posts: Post[];
  onRenameClick: (category: Category) => void;
  onDeleteCategoryClick: (category: Category) => void;
  onAddPostClick: (category: Category) => void;
  onDeletePostClick: (postId: string) => void;
  onMetadataExtracted?: (postId: string, metadata: { author?: string; searchText?: string }) => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  posts,
  onRenameClick,
  onDeleteCategoryClick,
  onAddPostClick,
  onDeletePostClick,
  onMetadataExtracted,
}) => {
  return (
    <section className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 md:p-6 mb-8 shadow-sm transition-all hover:border-slate-800">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-[22px] font-semibold text-slate-100 tracking-tight">
            {category.name}
          </h2>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
          <button
            onClick={() => onRenameClick(category)}
            type="button"
            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Rename category"
            aria-label={`Rename category ${category.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onDeleteCategoryClick(category)}
          type="button"
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
          title="Delete category"
          aria-label={`Delete category ${category.name}`}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">Delete category</span>
        </button>
      </div>

      {/* Posts Horizontal Scrolling Row */}
      {posts.length > 0 ? (
        <div className="relative group">
          <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar scroll-smooth">
            {posts.map((post) => (
              <PostEmbed
                key={post.id}
                url={post.url}
                tweetId={post.tweetId}
                onDelete={() => onDeletePostClick(post.id)}
                onMetadataExtracted={(metadata) => onMetadataExtracted?.(post.id, metadata)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty category state */
        <div className="py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center flex flex-col items-center justify-center my-2">
          <Bookmark className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
          <p className="text-sm text-slate-400 font-medium">No saved posts yet.</p>
        </div>
      )}

      {/* Add Link Control Under Category */}
      <div className="mt-4 pt-2">
        <button
          onClick={() => onAddPostClick(category)}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          Add link to post
        </button>
      </div>
    </section>
  );
};
